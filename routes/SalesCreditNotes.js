const express = require('express');
const router = express.Router();
const { getSalesOrderNotes, getSalesOrderNotesById, createSalesOrderNotes,
    updateSalesOrderNotes, deleteSalesOrderNotes,pagination,search} =require('../controllers/Api/SalesCreditNotesController.js')
router.route('/').get(getSalesOrderNotes).post(createSalesOrderNotes)
router.route('/paginate').get(pagination)
router.route('/search').post(search)

router.route('/:id').get(getSalesOrderNotesById).put(updateSalesOrderNotes).delete(deleteSalesOrderNotes);
module.exports = router;