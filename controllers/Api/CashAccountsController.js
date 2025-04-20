const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");


exports.createCashAccount = async(req, res) => {
	try
	{
		let account = req.body;

		let newCode = 0;

		let lvlTwoAccount;

		if(account.type === 'cash') {
			account.type = 'cash';
			lvlTwoAccount = await conn.level_two_chart_of_accounts.findOne({
				where: {
					name_en: 'Cash On Hand'
				}
			})
		}
		else if(account.type === 'bank'){
			account.type = 'bank';
			lvlTwoAccount = await conn.level_two_chart_of_accounts.findOne({
				where: {
					name_en: 'Cash in Banks'
				}
			})
		}

		const lvlTwoCode = lvlTwoAccount.code; 


		// get last level three account code 	
		const lastLvl3AccountAdded = await sequelize.query(`
			SELECT code FROM level_three_chart_of_accounts l3 WHERE l3.level_two_chart_of_account_id = ${lvlTwoAccount.id}
						ORDER BY l3.code DESC LIMIT 1
		`);

		console.log('lastLvl3AccountAdded', lastLvl3AccountAdded[0][0])

		const lastCode = parseInt(lastLvl3AccountAdded[0][0].code);

		newCode = lastCode + 1;
		account.code = newCode;
		account.level_two_chart_of_account_id = lvlTwoAccount.id;


		// saving account to level 3 accounts table
		const savedLvl3Account = await conn.level_three_chart_of_accounts.create(account);
		account.level_three_chart_of_account_id = savedLvl3Account.id;

		// saving account to cash accouts table
		const savedCashAccount = await conn.cash_accounts.create(account);


		res.status(200).json({status: true, data: savedCashAccount  });		
	}
	catch(error) {
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.pagination = async (req, res) => {
	try
	{
		console.log('query', req.query)
        var offset = (req.query.page - 1) * req.query.limit
        console.log("the offset", offset, "the limit is ", req.query.limit);
        const result = await conn.cash_accounts.findAll({
                              order: [['id', 'DESC']],
							  offset: offset,
							  limit: parseInt(req.query.limit),
							  subQuery: false
                            });
       
        var count = await conn.customers.count();
        res.status(200).json({ status: true, data: result, tot: count })
	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	} 
}