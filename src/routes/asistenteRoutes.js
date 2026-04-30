const { Router } = require('express');
const asistenteController = require('../controllers/asistenteController');
const { validateId, asistenteRules } = require('../middlewares/validators');

const router = Router();

router.get('/', asistenteController.getAll);
router.get('/:id', validateId, asistenteController.getById);
router.post('/', asistenteRules, asistenteController.create);
router.put('/:id', validateId, asistenteRules, asistenteController.update);
router.delete('/:id', validateId, asistenteController.delete);

module.exports = router;
