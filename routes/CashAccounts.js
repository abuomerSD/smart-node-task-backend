const express = require('express');
const router = express.Router();
const { createCashAccount, pagination } =require('../controllers/Api/CashAccountsController.js')

router.route('/').post(createCashAccount)
router.route('/paginate').post(createCashAccount)
// router.route('/search').post(search)
// router.route('/get-level3-account').get(getLevelThreeAccountsByName)
// router.route('/details/:id').get(getCashAccountDetailsById)


module.exports = router;