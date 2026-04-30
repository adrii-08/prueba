const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

// ─── Middleware para ejecutar las validaciones ─────────────────────────────
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Error de validación',
        details: errors.array().map((e) => ({
          campo: e.path,
          mensaje: e.msg,
          valor: e.value,
        })),
      },
    });
  }
  next();
}

// ─── Validar ID como entero positivo ───────────────────────────────────────
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
  runValidation,
];

// ─── Reglas de Sede ────────────────────────────────────────────────────────
const sedeRules = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 200 })
    .withMessage('El nombre no puede superar los 200 caracteres'),
  body('direccion')
    .trim()
    .notEmpty()
    .withMessage('La dirección es obligatoria')
    .isLength({ max: 500 })
    .withMessage('La dirección no puede superar los 500 caracteres'),
  body('capacidad')
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un número entero mayor a 0'),
  runValidation,
];

// ─── Reglas de Evento ──────────────────────────────────────────────────────
const eventoRules = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 300 })
    .withMessage('El nombre no puede superar los 300 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La descripción no puede superar los 5000 caracteres'),
  body('fecha_inicio')
    .notEmpty()
    .withMessage('La fecha de inicio es obligatoria')
    .isISO8601()
    .withMessage('La fecha de inicio debe tener formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)'),
  body('fecha_fin')
    .notEmpty()
    .withMessage('La fecha de fin es obligatoria')
    .isISO8601()
    .withMessage('La fecha de fin debe tener formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  body('id_sede')
    .isInt({ min: 1 })
    .withMessage('El ID de la sede debe ser un número entero positivo'),
  runValidation,
];

// ─── Reglas de Asistente ───────────────────────────────────────────────────
const asistenteRules = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede superar los 150 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 150 })
    .withMessage('El apellido no puede superar los 150 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede superar los 20 caracteres'),
  runValidation,
];

// ─── Reglas de Patrocinador ────────────────────────────────────────────────
const patrocinadorRules = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 200 })
    .withMessage('El nombre no puede superar los 200 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede superar los 20 caracteres'),
  runValidation,
];

// ─── Reglas para registrar asistente en evento ─────────────────────────────
const registroAsistenteRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del evento debe ser un número entero positivo'),
  body('asistente_id')
    .isInt({ min: 1 })
    .withMessage('El ID del asistente debe ser un número entero positivo'),
  runValidation,
];

// ─── Reglas para asignar patrocinador a evento ─────────────────────────────
const asignacionPatrocinadorRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del evento debe ser un número entero positivo'),
  body('patrocinador_id')
    .isInt({ min: 1 })
    .withMessage('El ID del patrocinador debe ser un número entero positivo'),
  body('monto_patrocinio')
    .isFloat({ min: 0.01 })
    .withMessage('El monto de patrocinio debe ser un número mayor a 0'),
  runValidation,
];

module.exports = {
  validateId,
  sedeRules,
  eventoRules,
  asistenteRules,
  patrocinadorRules,
  registroAsistenteRules,
  asignacionPatrocinadorRules,
};
