
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

        // saving the transaction
        const descr = req.body.descr;
        const descr_en = req.body.descr_en;

        const transaction = await conn.transactions.create({descr, descr_en, accounting_period_id: 1})
        

        // savig the transaction details
        const transaction_details = JSON.parse(req.body.records);
        transaction_details.forEach(detail => {
            detail.transaction_id = transaction.id;
        });

        await conn.transaction_details.bulkCreate(transaction_details);
        transaction.transaction_details = transaction_details;

        // saving the transaction documents

        const transaction_documents = JSON.parse(req.body.documents);

        // saving the files 
        let filesNames= [];
        let file_paths = ''

        for (let i = 0; i < transaction_documents.length; i++) {
            if(req['file'+i] && req['file' +i ].save){
                file_path = await req['file' +i ].save('./public/uploads')
                filesNames.push(file_path.split('uploads/')[1])
                console.log('file_path', file_path)
            }
                
        }   

        // adding filename and transaction_id to transcation_document

        for(let i=0; i < transaction_documents.length; i++) {
            transaction_documents[i].transaction_id = transaction.id;
            transaction_documents[i].file = filesNames[i]
        }
        transaction_documents.forEach(detail => {
            detail.transaction_id = transaction.id;
        });

        await conn.transaction_documents.bulkCreate(transaction_documents);
        transaction.transaction_documents = transaction_documents;


        res.status(200).json({status: true, data: transaction});

    } catch (error) {
        console.error(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}