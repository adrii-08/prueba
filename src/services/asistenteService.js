const prisma = require('../prisma/client');
const { AppError } = require('../middlewares/errorHandler');

class AsistenteService {
  /**
   * Obtener todos los asistentes con conteo de eventos.
   */
  async findAll() {
    return prisma.asistente.findMany({
      include: { _count: { select: { eventos: true } } },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Obtener un asistente por ID con sus eventos.
   */
  async findById(id) {
    const asistente = await prisma.asistente.findUnique({
      where: { id },
      include: {
        eventos: {
          include: {
            evento: {
              select: {
                id: true,
                nombre: true,
                fechaInicio: true,
                fechaFin: true,
                sede: { select: { nombre: true } },
              },
            },
          },
          orderBy: { fechaRegistro: 'desc' },
        },
        _count: { select: { eventos: true } },
      },
    });

    if (!asistente) {
      throw new AppError('Asistente no encontrado', 404);
    }

    return asistente;
  }

  /**
   * Crear un nuevo asistente.
   */
  async create(data) {
    return prisma.asistente.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono || null,
      },
    });
  }

  /**
   * Actualizar un asistente existente.
   */
  async update(id, data) {
    await this.findById(id);

    return prisma.asistente.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
      },
    });
  }

  /**
   * Eliminar un asistente.
   */
  async delete(id) {
    await this.findById(id);
    return prisma.asistente.delete({ where: { id } });
  }
}

module.exports = new AsistenteService();
