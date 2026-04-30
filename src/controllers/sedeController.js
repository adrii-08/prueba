const sedeService = require('../services/sedeService');

class SedeController {
  async getAll(req, res, next) {
    try {
      const sedes = await sedeService.findAll();
      res.json({ success: true, data: sedes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const sede = await sedeService.findById(Number(req.params.id));
      res.json({ success: true, data: sede });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const sede = await sedeService.create(req.body);
      res.status(201).json({ success: true, data: sede });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const sede = await sedeService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: sede });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await sedeService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Sede eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SedeController();
