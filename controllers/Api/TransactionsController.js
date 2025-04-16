
const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

exports.getLevelThreeAccounts = async(req, res) => {
    try {
        const accounts = await conn.level_three_chart_of_accounts.findAll();
        res.status(200).json({ status: true, data: accounts });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.createTransaction = async (req, res) => {
    try {

        
        const descr = req.body.descr;
        const descr_en = req.body.descr_en;

        console.log("records", JSON.parse(req.body.records));

        const transaction = await conn.transactions.create({descr, descr_en, accounting_period_id: 1})
        
        const transaction_details = JSON.parse(req.body.records);
        transaction_details.forEach(detail => {
            detail.transaction_id = transaction.id;
        });

        await conn.transaction_details.bulkCreate(transaction_details);
        transaction['transaction_details'] = transaction_details;

        const transaction_documents = JSON.parse(req.body.documents);

        // transaction_documents.forEach(async doc => {
        //     let file_path = '';
        //     if(doc.file) {
        //         file_path = await doc.file.save('./public/uploads');
        //     }
        //     doc.file = file_path.split('uploads/')[1];
        // });

        await conn.transaction_documents.bulkCreate(transaction_documents);
        transaction['transaction_documents'] = transaction_documents;


        res.status(200).json({status: true, data: transaction});

        // let file_path
        // if(req.file){
        //    file_path= await req.file.save('./public/uploads')
        // }
        // req.body.img= file_path.split('uploads/')[1]
        // console.log(req.body);
        // const result = await conn.products.create(req.body)

        // res.status(200).json({ status: true, data: result })
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}