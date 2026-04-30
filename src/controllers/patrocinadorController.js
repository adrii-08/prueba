const patrocinadorService = require('../services/patrocinadorService');

class PatrocinadorController {
  async getAll(req, res, next) {
    try {
      const patrocinadores = await patrocinadorService.findAll();
      res.json({ success: true, data: patrocinadores });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const patrocinador = await patrocinadorService.findById(Number(req.params.id));
      res.json({ success: true, data: patrocinador });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const patrocinador = await patrocinadorService.create(req.body);
      res.status(201).json({ success: true, data: patrocinador });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const patrocinador = await patrocinadorService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: patrocinador });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await patrocinadorService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Patrocinador eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatrocinadorController();
