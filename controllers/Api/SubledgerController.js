const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
// const payToCustomer = require('../../utils/payToCustomer.js');

exports.findSubledgerSubAccountByName = async(req, res) => {
	try
	{
		const sub_account = await conn.subledger_account_subaccounts.findOne({
			where: {
				name_en: req.body.name_en
			}
		});

		res.status(200).json({status: true, data: sub_account});

	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.createSubledgerTransactions = async(req, res) => {
	try
	{
		const created = await conn.subledger_transactions.create(req.body);
		res.status(200).json({status: true, data: created});
	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}