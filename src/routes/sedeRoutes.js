const { Router } = require('express');
const sedeController = require('../controllers/sedeController');
const { validateId, sedeRules } = require('../middlewares/validators');

const router = Router();

router.get('/', sedeController.getAll);
router.get('/:id', validateId, sedeController.getById);
router.post('/', sedeRules, sedeController.create);
router.put('/:id', validateId, sedeRules, sedeController.update);
router.delete('/:id', validateId, sedeController.delete);

module.exports = router;
