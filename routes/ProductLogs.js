const express = require('express')
const router = express.Router();
const { getProductLogs, getProductLogsByProductId, createProductLogs,updateProductLogsV2,
    updateProductLogs, deleteProductLogs,pagination,search} =require('../controllers/Api/ProductLogsController.js')
router.route('/').get(getProductLogs).post(createProductLogs)
router.route('/update').post(updateProductLogsV2)
router.route('/paginate').get(pagination)
router.route('/search').post(search)
router.route('/:id').get(getProductLogsByProductId).put(updateProductLogs).delete(deleteProductLogs);
module.exports = router;