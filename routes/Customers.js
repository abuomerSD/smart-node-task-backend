const express = require('express');
const router = express.Router();
const { createCustomer, getCustomersCategories, paginateCustomers,
		updateCustomer, deleteCustomer, searchCustomer, getCutomerTransations,
		getCutomerById } =require('../controllers/Api/CustomersController.js')

router.route('/').post(createCustomer)
router.route('/categories').get(getCustomersCategories)
router.route('/paginate').get(paginateCustomers)
router.route('/search').post(searchCustomer)
router.route('/statement/:id').get(getCutomerTransations)
router.route('/:id').put(updateCustomer).delete(deleteCustomer).get(getCutomerById)

module.exports = router;