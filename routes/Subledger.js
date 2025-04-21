const express = require('express');
const router = express.Router();
const { findSubledgerSubAccountByName, createSubledgerTransactions } =require('../controllers/Api/SubledgerController.js')

router.route('/searchSubAccount').post(findSubledgerSubAccountByName)
router.route('/transactions').post(createSubledgerTransactions)



module.exports = router;