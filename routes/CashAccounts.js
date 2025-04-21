const express = require('express');
const router = express.Router();
const { createCashAccount, paginationCashAccounts, updateCashAccount, deleteCashAccount,
paginationBankAccounts, search } =require('../controllers/Api/CashAccountsController.js')

router.route('/').post(createCashAccount)
router.route('/cash/paginate').get(paginationCashAccounts)
router.route('/bank/paginate').get(paginationBankAccounts)
router.route('/:lvl3AccountId').put(updateCashAccount).delete(deleteCashAccount)
router.route('/search').post(search)
// router.route('/get-level3-account').get(getLevelThreeAccountsByName)
// router.route('/details/:id').get(getCashAccountDetailsById)


module.exports = router;