// routes/categoriesRouter.js
const Router = require('express');
const router = Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.validateCategory, categoryController.createCategory);
router.put('/:id', categoryController.validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
