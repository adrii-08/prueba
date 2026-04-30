const { Router } = require('express');
const patrocinadorController = require('../controllers/patrocinadorController');
const { validateId, patrocinadorRules } = require('../middlewares/validators');

const router = Router();

router.get('/', patrocinadorController.getAll);
router.get('/:id', validateId, patrocinadorController.getById);
router.post('/', patrocinadorRules, patrocinadorController.create);
router.put('/:id', validateId, patrocinadorRules, patrocinadorController.update);
router.delete('/:id', validateId, patrocinadorController.delete);

module.exports = router;
