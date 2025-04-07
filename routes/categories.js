
const express = require('express')
const router = express.Router();
const { getCategories, getCategoriesById, createCategories,
    updateCategories, deleteCategories,pagination,search} =require('../controllers/Api/CategoriesController.js')
router.route('/').get(getCategories).post(createCategories)
router.route('/paginate').get(pagination)
router.route('/search').post(search)

router.route('/:id').get(getCategoriesById).put(updateCategories).delete(deleteCategories);
module.exports = router;