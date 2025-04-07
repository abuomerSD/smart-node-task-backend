
const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const fs = require('fs');



exports.selectProductsByFilter = async (req, res, next) =>
{
    var params = {
        limit: 10, page: 1, constrains: { name: "" },

    }
    const result = await filter.filter("Products", params)
    if (result)
    {
        res.status(200).json({ status: true, data: result, })
    }
    else
    {
        res.status(200).json({ status: false, msg: "No data founded", })
    }
}
exports.chartData = async (req, res, next) =>
{
    try
    {
        let regMonth = [];
        var tab = req.body.tab
        let type = req.body.type
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
        if (type == 1)
        {//day
            sequelize.query(`select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT COUNT(*) FROM ${tab} WHERE  date(${tab}.createdAt) =selected_date GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 month)) and CURRENT_DATE()) tmp;
      `)
                .then(function (response)
                {
                    res.status(200).json({ status: true, data: response[0] });
                }).error(function (err)
                {
                    // res.json(err);
                });

        }
        if (type == 2)
        {//month
            sequelize
                .query(`select v label,(SELECT COUNT(*) FROM ${tab} WHERE  DATE_FORMAT(${tab}.createdAt,"%Y-%m") =v GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m")) y  from(select DISTINCT DATE_FORMAT(selected_date,"%Y-%m") v from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where DATE_FORMAT(selected_date,"%Y-%m") between DATE_FORMAT((date_sub(now(),interval 1 year)),"%Y-%m") and DATE_FORMAT(now(),"%Y-%m")) tmp2;
        `)
                .then(function (response)
                {
                    res.status(200).json({ status: true, data: response[0] });
                }).error(function (err)
                {
                    res.json(err);
                });

        }
    } catch (error)
    {
        console.log(error)
    }
}

exports.search = async (req, res, next) =>
{
    var searchCol = req.body.col
    var offset = (req.body.page - 1) * req.body.limit
    var search = req.body.search
    await conn.products.findAll({
        limit: req.body.limit,
        offset: offset,
        include: [],
        where: {
            name: {
                [Op.like]: '%' + search + '%'
            }
        }
    }).then(async function (assets)
    {
        var count = await conn.products.count({
            where: {
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }
        });
        res.status(200).json({ status: true, data: assets, tot: count })
    }).catch(function (error)
    {
        console.log(error);
    });
}

//@decs   Get All 
//@route  GET
//@access Public
exports.getProducts = async (req, res, next) =>
{
    try
    {
        const result = await conn.products.findAll()
        console.log('get products');
        res.status(200).json({ status: true, data: result })

    }
    catch (e)
    {
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }


}
exports.createProducts = async (req, res, next) =>
{
    try
    {
        let file_path
        if(req.file){
           file_path= await req.file.save('./public/uploads')
        }
        req.body.img= file_path.split('uploads/')[1]
        console.log(req.body);
        const result = await conn.products.create(req.body)

        res.status(200).json({ status: true, data: result })


    }
    catch (e)
    {
        console.log(e)
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }


}

exports.pagination = async (req, res, next) =>
{
    try
    {
        let whereClause = {}
        if(req.query.category_id){
            whereClause={
                category_id:req.query.category_id
            }
        }
        var offset = (req.query.page - 1) * req.query.limit
        console.log("the offset", offset, "the limit is ", req.query.limit);
        var result = await conn.products.findAll({
            order: [["id", "DESC"]],
            include: [],
            offset: offset,
            limit: req.query.limit,
            subQuery: false,
            where:whereClause
        })
        console.log("the len is", result.length)
       
            var count = await conn.products.count();
            res.status(200).json({ status: true, data: result, tot: count })
        
    }
    catch (e)
    {
        console.log(e)
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}
//@decs   Get All 
//@route  GET
//@access Public
exports.getProductsById = async (req, res, next) =>
{
    try
    {
        const result = await conn.products.findOne({ where: { id: req.params.id } })
        if (result.length != 0)
            res.status(200).json({ status: true, data: result })
        else
        {
            res.status(200).json({ status: false, msg: `No data founded` })
        }
    }
    catch (e)
    {
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }


}

//@decs   Get All 
//@route  Put
//@access Public
exports.updateProducts = async (req, res, next) =>
{
    try
    {
        const isUpdated = await conn.products.update(req.body, { where: { id: req.params.id } })
        console.log('product id:',req.params.id);
        if (isUpdated)
            res.status(200).json({ status: true, data: req.body })
        else
        {
            res.status(200).json({ status: true, msg: "filed to update data" })
        }
    }
    catch (e)
    {
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })

    }

}



exports.updateProductsV2  = async (req, res, next) =>
    {
        console.log('update products');
        console.log("*".repeat(50));
        let newImagePath =''
        try
        {
            
            if(req.file) {
                newImagePath = await req.file.save('./public/uploads/');
                
                const oldProduct = await conn.products.findOne({
                    where: {
                        id: req.body.id,
                    }
                });
                try {
                    if(oldProduct.img && fs.existsSync('./public/uploads/'+ oldProduct.img)) {
                        fs.unlinkSync('./public/uploads/'+ oldProduct.img);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            if(newImagePath) {
                req.body.img = newImagePath.split('uploads/')[1];
            }
            await conn.products.update(req.body, { where: { id: req.body.id } })
            console.log('product id:',req.params.product_id);
            res.status(200).json({ status: true, data: req.body })
            
        }
        catch (e)
        {
            console.log(e);
            
            if(fs.existsSync(newImagePath)){
                fs.unlinkSync(newImagePath);
            }
            res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
            
        }
    
    }


//@decs   Get All 
//@route  Delete
//@access Public
exports.deleteProducts = async (req, res, next) =>
{
    try
    {
        const oldProduct = await conn.products.findOne({
            where: {
                id: req.params.id,
            }
        });
        console.log("image: ", oldProduct.img);
        console.log("*".repeat(50));
        if(oldProduct.img && fs.existsSync('./public/uploads/' + oldProduct.img)) {
            try {
                fs.unlinkSync('./public/uploads/' + oldProduct.img);
                
            } catch (error) {
                console.log(error)
            }
        }
        const isDeleted = await conn.products.destroy({ where: { id: req.params.id } })
        if (isDeleted)
            res.status(200).json({ status: true, msg: `data deleted successfully` })
        else
        {
            res.status(200).json({ status: false, msg: `filed to delete data` })
        }
    }
    catch (e)
    {
        console.log(e)
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }

}


