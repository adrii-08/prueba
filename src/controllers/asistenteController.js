const asistenteService = require('../services/asistenteService');

class AsistenteController {
  async getAll(req, res, next) {
    try {
      const asistentes = await asistenteService.findAll();
      res.json({ success: true, data: asistentes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const asistente = await asistenteService.findById(Number(req.params.id));
      res.json({ success: true, data: asistente });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const asistente = await asistenteService.create(req.body);
      res.status(201).json({ success: true, data: asistente });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const asistente = await asistenteService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: asistente });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await asistenteService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Asistente eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AsistenteController();
