
const express = require('express')
const router = express.Router();
const { getProducts, getProductsById, createProducts,updateProductsV2,
    updateProducts, deleteProducts,pagination,search} =require('../controllers/Api/ProductsController.js')
router.route('/').get(getProducts).post(createProducts)
router.route('/update').post(updateProductsV2)
router.route('/paginate').get(pagination)
router.route('/search').post(search)
router.route('/:id').get(getProductsById).put(updateProducts).delete(deleteProducts);
module.exports = router;