const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");


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
		console.log('--------------------------------------')
        console.log('query', req.query)
        var offset = (req.query.page - 1) * req.query.limit
        console.log("the offset", offset, "the limit is ", req.query.limit);
        const result = await conn.customers.findAll({
                              order: [['id', 'DESC']],
							  include: [
							    {
							      model: conn.customer_categories,
							      as: 'customer_categories',
							      attributes: ['name']
							    }
							  ],
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