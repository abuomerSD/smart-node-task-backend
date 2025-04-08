const express = require('express')
const router = express.Router();
const { getSalesOrderDetails, getSalesOrderDetailsById, createSalesOrderDetails,
    updateSalesOrderDetails, deleteSalesOrderDetails ,search, pagination} =require('../controllers/Api/SalesOrderDetailsController.js')
router.route('/').get(getSalesOrderDetails).post(createSalesOrderDetails)
router.route('/paginate').get(pagination)
router.route('/search').post(search)

router.route('/:id').get(getSalesOrderDetailsById).put(updateSalesOrderDetails).delete(deleteSalesOrderDetails);
module.exports = router;