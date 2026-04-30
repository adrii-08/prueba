const prisma = require('../prisma/client');
const { AppError } = require('../middlewares/errorHandler');

class EventoService {
  /**
   * Obtener todos los eventos con sede, conteos de asistentes y patrocinadores.
   */
  async findAll() {
    return prisma.evento.findMany({
      include: {
        sede: { select: { id: true, nombre: true, capacidad: true } },
        _count: {
          select: {
            asistentes: true,
            patrocinadores: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  /**
   * Obtener un evento por ID con toda la información relacionada.
   */
  async findById(id) {
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        sede: true,
        asistentes: {
          include: {
            asistente: {
              select: { id: true, nombre: true, apellido: true, email: true },
            },
          },
          orderBy: { fechaRegistro: 'desc' },
        },
        patrocinadores: {
          include: {
            patrocinador: {
              select: { id: true, nombre: true, email: true },
            },
          },
        },
        _count: {
          select: {
            asistentes: true,
            patrocinadores: true,
          },
        },
      },
    });

    if (!evento) {
      throw new AppError('Evento no encontrado', 404);
    }

    return evento;
  }

  /**
   * Crear un nuevo evento. Valida que la sede exista.
   */
  async create(data) {
    // Verificar que la sede existe
    const sede = await prisma.sede.findUnique({
      where: { id: data.id_sede },
    });

    if (!sede) {
      throw new AppError(`La sede con ID ${data.id_sede} no existe`, 404);
    }

    return prisma.evento.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        fechaInicio: new Date(data.fecha_inicio),
        fechaFin: new Date(data.fecha_fin),
        sedeId: data.id_sede,
      },
      include: {
        sede: { select: { id: true, nombre: true } },
      },
    });
  }

  /**
   * Actualizar un evento existente.
   */
  async update(id, data) {
    await this.findById(id); // Verifica que exista

    // Si cambia la sede, verificar que la nueva sede exista
    if (data.id_sede) {
      const sede = await prisma.sede.findUnique({
        where: { id: data.id_sede },
      });
      if (!sede) {
        throw new AppError(`La sede con ID ${data.id_sede} no existe`, 404);
      }
    }

    return prisma.evento.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fechaInicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
        fechaFin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
        sedeId: data.id_sede,
      },
      include: {
        sede: { select: { id: true, nombre: true } },
      },
    });
  }

  /**
   * Eliminar un evento y sus relaciones (cascada configurada en schema).
   */
  async delete(id) {
    await this.findById(id);
    return prisma.evento.delete({ where: { id } });
  }

  // ──────────────────────────────────────────────────────────────────────
  //  ASISTENTES
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Registrar un asistente en un evento.
   * Valida: que existan ambos, que no esté ya registrado, y la capacidad de la sede.
   */
  async registrarAsistente(eventoId, asistenteId) {
    // 1. Obtener evento con sede y conteo de asistentes
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        sede: true,
        _count: { select: { asistentes: true } },
      },
    });

    if (!evento) {
      throw new AppError('Evento no encontrado', 404);
    }

    // 2. Verificar que el asistente existe
    const asistente = await prisma.asistente.findUnique({
      where: { id: asistenteId },
    });

    if (!asistente) {
      throw new AppError('Asistente no encontrado', 404);
    }

    // 3. Verificar que no esté ya registrado
    const yaRegistrado = await prisma.eventoAsistente.findUnique({
      where: {
        eventoId_asistenteId: { eventoId, asistenteId },
      },
    });

    if (yaRegistrado) {
      throw new AppError(
        `El asistente "${asistente.nombre} ${asistente.apellido}" ya está registrado en el evento "${evento.nombre}"`,
        409
      );
    }

    // 4. ✅ Validar capacidad de la sede
    if (evento._count.asistentes >= evento.sede.capacidad) {
      throw new AppError(
        `El evento "${evento.nombre}" ha alcanzado la capacidad máxima de la sede "${evento.sede.nombre}" (${evento.sede.capacidad} asistentes)`,
        409
      );
    }

    // 5. Registrar
    return prisma.eventoAsistente.create({
      data: { eventoId, asistenteId },
      include: {
        asistente: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        evento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

  /**
   * Remover un asistente de un evento.
   */
  async removerAsistente(eventoId, asistenteId) {
    const registro = await prisma.eventoAsistente.findUnique({
      where: {
        eventoId_asistenteId: { eventoId, asistenteId },
      },
    });

    if (!registro) {
      throw new AppError('El asistente no está registrado en este evento', 404);
    }

    return prisma.eventoAsistente.delete({
      where: {
        eventoId_asistenteId: { eventoId, asistenteId },
      },
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  //  PATROCINADORES
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Asignar un patrocinador a un evento con un monto.
   */
  async asignarPatrocinador(eventoId, patrocinadorId, montoPatrocinio) {
    // 1. Verificar que el evento existe
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento) {
      throw new AppError('Evento no encontrado', 404);
    }

    // 2. Verificar que el patrocinador existe
    const patrocinador = await prisma.patrocinador.findUnique({
      where: { id: patrocinadorId },
    });

    if (!patrocinador) {
      throw new AppError('Patrocinador no encontrado', 404);
    }

    // 3. Verificar que no esté ya asignado
    const yaAsignado = await prisma.eventoPatrocinador.findUnique({
      where: {
        eventoId_patrocinadorId: { eventoId, patrocinadorId },
      },
    });

    if (yaAsignado) {
      throw new AppError(
        `El patrocinador "${patrocinador.nombre}" ya está asignado al evento "${evento.nombre}". Use PUT para actualizar el monto.`,
        409
      );
    }

    // 4. Asignar
    return prisma.eventoPatrocinador.create({
      data: { eventoId, patrocinadorId, montoPatrocinio },
      include: {
        patrocinador: {
          select: { id: true, nombre: true, email: true },
        },
        evento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

  /**
   * Actualizar el monto de patrocinio de un patrocinador en un evento.
   */
  async actualizarMontoPatrocinador(eventoId, patrocinadorId, montoPatrocinio) {
    const registro = await prisma.eventoPatrocinador.findUnique({
      where: {
        eventoId_patrocinadorId: { eventoId, patrocinadorId },
      },
    });

    if (!registro) {
      throw new AppError('El patrocinador no está asignado a este evento', 404);
    }

    return prisma.eventoPatrocinador.update({
      where: {
        eventoId_patrocinadorId: { eventoId, patrocinadorId },
      },
      data: { montoPatrocinio },
      include: {
        patrocinador: {
          select: { id: true, nombre: true, email: true },
        },
        evento: {
          select: { id: true, nombre: true },
        },
      },
    });
  }

  /**
   * Remover un patrocinador de un evento.
   */
  async removerPatrocinador(eventoId, patrocinadorId) {
    const registro = await prisma.eventoPatrocinador.findUnique({
      where: {
        eventoId_patrocinadorId: { eventoId, patrocinadorId },
      },
    });

    if (!registro) {
      throw new AppError('El patrocinador no está asignado a este evento', 404);
    }

    return prisma.eventoPatrocinador.delete({
      where: {
        eventoId_patrocinadorId: { eventoId, patrocinadorId },
      },
    });
  }
}

module.exports = new EventoService();
