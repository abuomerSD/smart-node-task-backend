const express = require('express');
const router = express.Router();
const { createCustomer, getCustomersCategories, paginateCustomers,
		updateCustomer, deleteCustomer, searchCustomer } =require('../controllers/Api/CustomersController.js')

router.route('/').post(createCustomer)
router.route('/categories').get(getCustomersCategories)
router.route('/paginate').get(paginateCustomers)
router.route('/search').post(searchCustomer)
router.route('/:id').put(updateCustomer).delete(deleteCustomer)

module.exports = router;