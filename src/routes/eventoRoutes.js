const { Router } = require('express');
const eventoController = require('../controllers/eventoController');
const {
  validateId,
  eventoRules,
  registroAsistenteRules,
  asignacionPatrocinadorRules,
} = require('../middlewares/validators');

const router = Router();

// ── CRUD de Eventos ─────────────────────────────────────────────────────
router.get('/', eventoController.getAll);
router.get('/:id', validateId, eventoController.getById);
router.post('/', eventoRules, eventoController.create);
router.put('/:id', validateId, eventoRules, eventoController.update);
router.delete('/:id', validateId, eventoController.delete);

// ── Asistentes del Evento ───────────────────────────────────────────────
// POST /api/eventos/:id/asistentes         → Registrar asistente
// DELETE /api/eventos/:id/asistentes/:asistenteId → Remover asistente
router.post(
  '/:id/asistentes',
  registroAsistenteRules,
  eventoController.registrarAsistente
);
router.delete(
  '/:id/asistentes/:asistenteId',
  eventoController.removerAsistente
);

// ── Patrocinadores del Evento ───────────────────────────────────────────
// POST /api/eventos/:id/patrocinadores        → Asignar patrocinador
// PUT /api/eventos/:id/patrocinadores/:patrocinadorId → Actualizar monto
// DELETE /api/eventos/:id/patrocinadores/:patrocinadorId → Remover
router.post(
  '/:id/patrocinadores',
  asignacionPatrocinadorRules,
  eventoController.asignarPatrocinador
);
router.put(
  '/:id/patrocinadores/:patrocinadorId',
  eventoController.actualizarMontoPatrocinador
);
router.delete(
  '/:id/patrocinadores/:patrocinadorId',
  eventoController.removerPatrocinador
);

module.exports = router;
