const express = require('express');
const router = express.Router();
const { getLevelThreeAccount } =require('../controllers/Api/TransactionsController.js')
router.route('/').get(getLevelThreeAccount)

module.exports = router;