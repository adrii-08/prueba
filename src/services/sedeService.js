const prisma = require('../prisma/client');
const { AppError } = require('../middlewares/errorHandler');

class SedeService {
  /**
   * Obtener todas las sedes con conteo de eventos asociados.
   */
  async findAll() {
    return prisma.sede.findMany({
      include: { _count: { select: { eventos: true } } },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Obtener una sede por ID con sus eventos.
   */
  async findById(id) {
    const sede = await prisma.sede.findUnique({
      where: { id },
      include: {
        eventos: {
          select: {
            id: true,
            nombre: true,
            fechaInicio: true,
            fechaFin: true,
          },
          orderBy: { fechaInicio: 'asc' },
        },
        _count: { select: { eventos: true } },
      },
    });

    if (!sede) {
      throw new AppError('Sede no encontrada', 404);
    }

    return sede;
  }

  /**
   * Crear una nueva sede.
   */
  async create(data) {
    return prisma.sede.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        capacidad: data.capacidad,
      },
    });
  }

  /**
   * Actualizar una sede existente.
   */
  async update(id, data) {
    await this.findById(id); // Verifica que exista

    return prisma.sede.update({
      where: { id },
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        capacidad: data.capacidad,
      },
    });
  }

  /**
   * Eliminar una sede. Falla si tiene eventos asociados.
   */
  async delete(id) {
    const sede = await this.findById(id);

    if (sede._count.eventos > 0) {
      throw new AppError(
        `No se puede eliminar la sede "${sede.nombre}" porque tiene ${sede._count.eventos} evento(s) asociado(s). Elimine o reasigne los eventos primero.`,
        409
      );
    }

    return prisma.sede.delete({ where: { id } });
  }
}

module.exports = new SedeService();
