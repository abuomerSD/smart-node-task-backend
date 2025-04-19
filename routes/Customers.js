const express = require('express');
const router = express.Router();
const { createCustomer, getCustomersCategories, paginateCustomers } =require('../controllers/Api/CustomersController.js')

router.route('/').post(createCustomer)
router.route('/categories').get(getCustomersCategories)
router.route('/paginate').get(paginateCustomers)
// router.route('/search').post(search)
// router.route('/get-level3-account').get(getLevelThreeAccountsByName)
// router.route('/details/:id').get(getCustomerDetailsById)


module.exports = router;