const express = require('express')
const router = express.Router();
const { getSalesOrder, getSalesOrderById, createSalesOrder,
    updateSalesOrder, deleteSalesOrder ,search, pagination,
    getSalesOrderDetailsByOrderId, getSalesDataOfLastWeek, getSalesDataOfLastYear, 
    getSalesDataOfLastMonthByProductId} =require('../controllers/Api/SalesOrderController.js')

router.route('/').get(getSalesOrder).post(createSalesOrder)
router.route('/paginate').get(pagination)
router.route('/search').post(search)
router.route('/sales-of-last-week').get(getSalesDataOfLastWeek)
router.route('/sales-of-last-year').get(getSalesDataOfLastYear)
router.route('/sales-of-last-month-by-productid/:product_id').get(getSalesDataOfLastMonthByProductId)
router.route('/:id').get(getSalesOrderById).put(updateSalesOrder).delete(deleteSalesOrder);
router.route('/get-details/:id').get(getSalesOrderDetailsByOrderId);
module.exports = router;