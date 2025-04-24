const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes, literal } = require("sequelize");


exports.createCustomer = async(req, res) => {
	try
	{
		const customer = await conn.customers.create(req.body);

		res.status(200).json({status: true, data: customer});
	}
	catch(error)
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.getCustomersCategories = async(req, res) => {
	try
	{
		const customers_categories = await conn.customer_categories.findAll();

		res.status(200).json({status: true, data: customers_categories});
	}
	catch(eror) 
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.paginateCustomers = async(req, res) => {
	try
	{
		// console.log('--------------------------------------')
        // console.log('query', req.query)
        // var offset = (req.query.page - 1) * req.query.limit
        // console.log("the offset", offset, "the limit is ", req.query.limit);
        // const result = await conn.customers.findAll({
        //                       order: [['id', 'DESC']],
		// 					  // include: [
		// 					  //   {
		// 					  //     model: conn.customer_categories,
		// 					  //     as: 'customer_categories',
		// 					  //     attributes: ['name']
		// 					  //   }
		// 					  // ],
		// 					  offset: offset,
		// 					  limit: parseInt(req.query.limit),
		// 					  subQuery: false
        //                     });
       

        const { fn, col, literal, Sequelize } = require('sequelize');

			const result = await conn.customers.findAll({
			  attributes: {
			    include: [
			      [
			        // Subquery for balance
			        Sequelize.literal(`(
			          SELECT 
			            COALESCE(SUM(CASE WHEN type = 'debit' THEN value ELSE 0 END), 0) -
			            COALESCE(SUM(CASE WHEN type = 'credit' THEN value ELSE 0 END), 0)
			          FROM subledger_transactions 
			          WHERE subledger_transactions.record_id = customers.id
			        )`),
			        'balance'
			      ]
			    ]
			  },
			  order: [['id', 'DESC']],
			  offset: (req.query.page - 1) * req.query.limit,
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

exports.updateCustomer = async (req, res) => {
	try
    {
        const isUpdated = await conn.customers.update(req.body, { where: { id: req.params.id } })
        if (isUpdated)
            res.status(200).json({ status: true, data: req.body })
        else
        {
            res.status(200).json({ status: true, msg: "failed to update data" })
        }
    }
    catch (e)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    

    }
}

exports.deleteCustomer = async(req, res) => {
	try
    {
    	const isExist = await conn.subledger_transactions.findAll({
    		where: {
    			record_id: req.params.id,
    		}
    	})
    	if(isExist.length > 0) {
    		res.status(200).json({ status: false, msg: `You can't delete a customer has trancations` })
    		return
    	}
        const isDeleted = await conn.customers.destroy({ where: { id: req.params.id } })
        if (isDeleted)
            res.status(200).json({ status: true, msg: `data deleted successfully` })
        else
        {
            res.status(200).json({ status: false, msg: `filed to delete data` })
        }
    }
    catch (e)
    {
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.searchCustomer = async (req, res) => {
	try
	{
	    var search = req.body.search
	    const data = await conn.customers.findAll({

	        where: {
	           [Op.or]: [
	        		{ name: { [Op.like]: '%' + search + '%' } },
	        		{ tel: { [Op.like]: '%' + search + '%' } },
	        		{ email : {  [Op.like]: '%' + search + '%'} }
	        	]
	        }
	    });

	    res.status(200).json({status: true, data});
	}	
	catch(error) {
				console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}

exports.getCutomerTransations = async (req, res) => {
	try
	{
		const id = req.params.id;
		var offset = (req.query.page - 1) * req.query.limit
	    
	    const data = await conn.subledger_transactions.findAll({
	    			  limit: req.query.limit,
        			  offset: offset,
					  where: {
					    record_id: id,
					  },
					  // order: [
					  //   [literal(`CASE WHEN type = 'debit' THEN 0 ELSE 1 END`), 'ASC']
					  // ],
					  order: [['id', 'DESC']],
					  include: [
						  {
						    model: conn.subledger_account_subaccounts,
						    as: 'subledger_subaccount', 
						    attributes: ['name_en']
						  }
						]
		});

		const count = await conn.subledger_transactions.count({
			where: {
				record_id: id,
			}
		})

		console.log('--------------------------')
		console.log('data', data)

	    let totalDebit = 0;
	    let totalCredit = 0;
	    let balance = 0;

	    data.forEach(trancation => {
	    	if(trancation.type === 'debit'){
	    		totalDebit += Number(trancation.value)
	    	}

	    	if(trancation.type === 'credit') {
	    		totalCredit += Number(trancation.value)
	    	}
	    })

	    balance = totalDebit - totalCredit;
	    res.status(200).json({status: true, data, balance, tot: count});
	}	
	catch(error) {
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` , error: error.message })    
	}
}

exports.getCutomerById = async(req, res)  => {
	try
	{
		const id = req.params.id;
		const data = await conn.customers.findOne({
			where: {id}
		});

		res.status(200).json({status: true, data});
	}
	catch(error) 
	{
		console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })    
	}
}