// routes/itemsRouter.js
const Router = require('express');
const router = Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.get('/category/:id', itemController.getItemsByCategory);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.patch('/:id/quantity', itemController.adjustItemQuantity);
router.patch('/:id/price', itemController.updateItemPrice);
router.patch('/category/:oldCategoryId/reassign', itemController.reassignCategoryItems);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
