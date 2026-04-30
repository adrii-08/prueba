const prisma = require('../prisma/client');
const { AppError } = require('../middlewares/errorHandler');

class PatrocinadorService {
  /**
   * Obtener todos los patrocinadores con conteo de eventos.
   */
  async findAll() {
    return prisma.patrocinador.findMany({
      include: { _count: { select: { eventos: true } } },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Obtener un patrocinador por ID con sus eventos y montos.
   */
  async findById(id) {
    const patrocinador = await prisma.patrocinador.findUnique({
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
              },
            },
          },
        },
        _count: { select: { eventos: true } },
      },
    });

    if (!patrocinador) {
      throw new AppError('Patrocinador no encontrado', 404);
    }

    return patrocinador;
  }

  /**
   * Crear un nuevo patrocinador.
   */
  async create(data) {
    return prisma.patrocinador.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || null,
      },
    });
  }

  /**
   * Actualizar un patrocinador existente.
   */
  async update(id, data) {
    await this.findById(id);

    return prisma.patrocinador.update({
      where: { id },
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
      },
    });
  }

  /**
   * Eliminar un patrocinador.
   */
  async delete(id) {
    await this.findById(id);
    return prisma.patrocinador.delete({ where: { id } });
  }
}

module.exports = new PatrocinadorService();
