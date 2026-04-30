const eventoService = require('../services/eventoService');

class EventoController {
  async getAll(req, res, next) {
    try {
      const eventos = await eventoService.findAll();
      res.json({ success: true, data: eventos });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const evento = await eventoService.findById(Number(req.params.id));
      res.json({ success: true, data: evento });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const evento = await eventoService.create(req.body);
      res.status(201).json({ success: true, data: evento });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const evento = await eventoService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: evento });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await eventoService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Evento eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }

  // ── Asistentes ──────────────────────────────────────────────────────
  async registrarAsistente(req, res, next) {
    try {
      const resultado = await eventoService.registrarAsistente(
        Number(req.params.id),
        Number(req.body.asistente_id)
      );
      res.status(201).json({
        success: true,
        message: 'Asistente registrado en el evento exitosamente',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async removerAsistente(req, res, next) {
    try {
      await eventoService.removerAsistente(
        Number(req.params.id),
        Number(req.params.asistenteId)
      );
      res.json({
        success: true,
        message: 'Asistente removido del evento exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Patrocinadores ──────────────────────────────────────────────────
  async asignarPatrocinador(req, res, next) {
    try {
      const resultado = await eventoService.asignarPatrocinador(
        Number(req.params.id),
        Number(req.body.patrocinador_id),
        Number(req.body.monto_patrocinio)
      );
      res.status(201).json({
        success: true,
        message: 'Patrocinador asignado al evento exitosamente',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizarMontoPatrocinador(req, res, next) {
    try {
      const resultado = await eventoService.actualizarMontoPatrocinador(
        Number(req.params.id),
        Number(req.params.patrocinadorId),
        Number(req.body.monto_patrocinio)
      );
      res.json({
        success: true,
        message: 'Monto de patrocinio actualizado exitosamente',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async removerPatrocinador(req, res, next) {
    try {
      await eventoService.removerPatrocinador(
        Number(req.params.id),
        Number(req.params.patrocinadorId)
      );
      res.json({
        success: true,
        message: 'Patrocinador removido del evento exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventoController();
