const express = require('express');
const router = express.Router();
const { getLevelThreeAccounts, createTransaction } =require('../controllers/Api/TransactionsController.js')
router.route('/').post(createTransaction)
router.route('/get-all-level3-accounts').get(getLevelThreeAccounts)

module.exports = router;