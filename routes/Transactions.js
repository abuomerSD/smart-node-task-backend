const express = require('express');
const router = express.Router();
const { getLevelThreeAccountsByName, createTransaction, paginateTransactions, search,
	getTransactionDetailsById } =require('../controllers/Api/TransactionsController.js')

router.route('/').post(createTransaction)
router.route('/paginate').get(paginateTransactions)
router.route('/search').post(search)
router.route('/get-level3-account').get(getLevelThreeAccountsByName)
router.route('/details/:id').get(getTransactionDetailsById)


module.exports = router;