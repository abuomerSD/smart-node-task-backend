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

		// console.log('lastLvl3AccountAdded', lastLvl3AccountAdded[0][0])
		// console.log('lvlTwoCode', lvlTwoCode)

		let lastCode = 0;
		if(lastLvl3AccountAdded[0][0].code){
			lastCode = parseInt(lastLvl3AccountAdded[0][0].code);
		} else {
			lastCode = lvlTwoCode;
		}


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

exports.paginationCashAccounts = async (req, res) => {
	try
	{
		console.log('query', req.query);
		const offset = (req.query.page - 1) * req.query.limit;
		console.log("the offset", offset, "the limit is ", req.query.limit);

		const result = await conn.cash_accounts.findAll({
		    where: { type: "cash" },
		    order: [['id', 'DESC']],
		    offset: offset,
		    limit: parseInt(req.query.limit),
		    subQuery: false,
		});

		const count = await conn.cash_accounts.count({
		    where: { type: 'cash' }
		});

		const updatedResult = await Promise.all(result.map(async r => {
		    let totalDebit = 0;
		    let totalCredit = 0;

		    const transaction_details = await conn.transaction_details.findAll({
		        where: {
		            account_id: r.level_three_chart_of_account_id
		        }
		    });

		    transaction_details.forEach(detail => {
		        if (detail.type === 'debit') {
		            totalDebit += Number(detail.value);
		        } else if (detail.type === 'credit') {
		            totalCredit += Number(detail.value);
		        }
		    });

		    const balance = totalDebit - totalCredit;

		    return {
		        ...r.toJSON(),
		        balance
		    };
		}));

		res.status(200).json({ status: true, data: updatedResult, tot: count });

	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	} 
}

exports.paginationBankAccounts = async (req, res) => {
	try
	{
		console.log('query', req.query);
		const offset = (req.query.page - 1) * req.query.limit;
		console.log("the offset", offset, "the limit is ", req.query.limit);

		const result = await conn.cash_accounts.findAll({
		    where: { type: "bank" },
		    order: [['id', 'DESC']],
		    offset: offset,
		    limit: parseInt(req.query.limit),
		    subQuery: false,
		});

		const count = await conn.cash_accounts.count({
		    where: { type: 'bank' }
		});

		const updatedResult = await Promise.all(result.map(async r => {
		    let totalDebit = 0;
		    let totalCredit = 0;

		    const transaction_details = await conn.transaction_details.findAll({
		        where: {
		            account_id: r.level_three_chart_of_account_id
		        }
		    });

		    transaction_details.forEach(detail => {
		        if (detail.type === 'debit') {
		            totalDebit += Number(detail.value);
		        } else if (detail.type === 'credit') {
		            totalCredit += Number(detail.value);
		        }
		    });

		    const balance = totalDebit - totalCredit;

		    return {
		        ...r.toJSON(),
		        balance
		    };
		}));

		res.status(200).json({ status: true, data: updatedResult, tot: count });
	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	} 
}

exports.updateCashAccount = async (req, res) => {
	try
	{
		const account = req.body;
		console.log('body ', req.body)
		const cash_account_update = await sequelize.query(`
			UPDATE cash_accounts SET name = '${account.name}', name_en= '${account.name_en}', account_number = ${account.account_number} WHERE level_three_chart_of_account_id = ${account.level_three_chart_of_account_id}
		`)

		const lvl3_account_update = await sequelize.query(`
			UPDATE level_three_chart_of_accounts SET name = '${account.name}', name_en='${account.name_en}' WHERE id= ${account.level_three_chart_of_account_id}
		`)

		res.status(200).json({status: true, data: {cash_account_update, lvl3_account_update}})
	}
	catch(error) 
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.deleteCashAccount = async (req, res) => {
	try 
	{
		const id = req.params.lvl3AccountId;
		// if cash account has operations dont delete
		const transaction_details = await conn.transaction_details.findAll({
			where: {
				account_id : id,
			}
		});
		if (transaction_details.length > 0) {
			res.status(200).json({status: false, msg: 'لا يمكنك حذف حساب لديه حركة'});
			return;
		}


		const cash_accounts_delete = await conn.cash_accounts.destroy({
			where: {
				level_three_chart_of_account_id: id,
			}
		})

		const lvl3_account_delete = await conn.level_three_chart_of_accounts.destroy({
			where: {
				id
			}
		})

		res.status(200).json({status: true});
	}
	catch(error) {
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.search = async (req, res) => {
	try
	{
		var searchCol = req.body.col
	    var offset = (req.body.page - 1) * req.body.limit
	    var search = req.body.search
	    const accounts = await conn.cash_accounts.findAll({
	        where: {
	        	[Op.or]: [
	        		{ name: { [Op.like]: '%' + search + '%' } },
	        		{ name_en : {  [Op.like]: '%' + search + '%'} }
	        	]
	        }
	    });
	    res.status(200).json({ status: true, data: accounts })
	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}