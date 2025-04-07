const express = require('express')
const router = express.Router();
const { getSalesOrder, getSalesOrderById, createSalesOrder,
    updateSalesOrder, deleteSalesOrder ,search, pagination} =require('../controllers/Api/SalesOrderController.js')
router.route('/').get(getSalesOrder).post(createSalesOrder)
router.route('/paginate').get(pagination)
router.route('/search').post(search)

router.route('/:id').get(getSalesOrderById).put(updateSalesOrder).delete(deleteSalesOrder);
module.exports = router;