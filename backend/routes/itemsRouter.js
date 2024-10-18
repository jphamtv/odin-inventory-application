// routes/categoriesRouter.js
const Router = require('express');
const router = Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
