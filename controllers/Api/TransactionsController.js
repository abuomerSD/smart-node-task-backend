
const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// exports.getLevelThreeAccounts = async(req, res) => {
//     try {
//         const accounts = await conn.level_three_chart_of_accounts.findAll();
//         res.status(200).json({ status: true, data: accounts });
//     } catch (error) {
//         console.log(error);
//         res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
//     }
// }

exports.getLevelThreeAccountsByName = async (req, res) => {
    try
    {   
        console.log('query', req.query);
        const search = req.query.search;
        const accounts = await conn.level_three_chart_of_accounts.findAll({
            where: {
                    name_en: {
                        [Op.like]: '%' + search + '%'
                    }
        } 
    })

        res.status(200).json({status: true, data: accounts});
    }
    catch(error) 
    {
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

        if(req.files) {
            for (let i = 0; i < transaction_documents.length; i++) {
            if(req['file'+i] && req['file' +i ].save){
                file_path = await req['file' +i ].save('./public/uploads')
                filesNames.push(file_path.split('uploads/')[1])
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
        } 

        res.status(200).json({status: true, data: transaction});

    } catch (error) {
        console.error(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.paginateTransactions = async(req, res) => {
    try{  

        console.log('--------------------------------------')
        console.log('query', req.query)
        var offset = (req.query.page - 1) * req.query.limit
        console.log("the offset", offset, "the limit is ", req.query.limit);
        const result = await conn.transactions.findAll({
                              order: [["id", "DESC"]],
                              attributes: {
                                include: [
                                  [
                                    sequelize.literal(`(
                                      SELECT SUM(value)
                                      FROM transaction_details
                                      WHERE transaction_details.transaction_id = transactions.id
                                      AND transaction_details.type = 'debit'
                                    )`),
                                    'amount'
                                  ]
                                ]
                              },
                              offset: offset,
                              limit: req.query.limit,
                              subQuery: false
                            });
       
        var count = await conn.transactions.count();
        res.status(200).json({ status: true, data: result, tot: count })
    } catch(error) {
        console.error(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
    
}

exports.search = async(req, res) => {
    try
    {
        var searchCol = req.body.col
        var offset = (req.body.page - 1) * req.body.limit
        var search = req.body.search
        await conn.transactions.findAll({
            limit: req.body.limit,
            offset: offset,
            include: [],
            where: {
                id: {
                    [Op.like]: '%' + search + '%'
                }
            }
        }).then(async function (assets)
        {
            var count = await conn.transactions.count({
                where: {
                    id: {
                        [Op.like]: '%' + search + '%'
                    }
                }
            });
            res.status(200).json({ status: true, data: assets, tot: count })
        })
    }
    catch(error)
    {
        console.error(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getTransactionDetailsById = async(req, res) => {
    try 
    {
        const { id } = req.params;
        const details = await sequelize.query(`
            SELECT 
                  td.account_id, 
                  td.type, 
                  td.value, 
                  td.descr_en,
                  td.created,
                  l3.name_en AS account_name
                FROM 
                  transaction_details td
                JOIN 
                  level_three_chart_of_accounts l3
                ON 
                  td.account_id = l3.id
                WHERE 
                  td.transaction_id = ${id}
                ORDER BY 
                  CASE 
                    WHEN td.type = 'debit' THEN 0
                    WHEN td.type = 'credit' THEN 1
                    ELSE 2
                  END;
        `);

        const documents = await conn.transaction_documents.findAll( {
            where: {
                transaction_id : id
            }
        });


        res.status(200).json({ status: true, data: {details: details[0], documents} });
    }
    catch(error) 
    {
        console.error(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })

    }
}