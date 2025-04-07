
const { conn, sequelize } = require('../../db/conn')
const { Sequelize, Op, Model, DataTypes } = require("sequelize");




exports.selectSalesOrderByFilter = async (req, res, next) =>
{
    var params = {
        limit: 10, page: 1, constrains: { name: "" },

    }
    const result = await filter.filter("SalesOrder", params)
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
    await conn.sale_order.findAll({
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
        var count = await conn.sale_order.count({
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
exports.getSalesOrder = async (req, res, next) =>
{
    try
    {
        const result = await conn.sale_order.findAll()

        res.status(200).json({ status: true, data: result })

    }
    catch (e)
    {
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }


}
exports.createSalesOrder = async (req, res, next) =>
{
    try
    {
        let file_path = '';
        if(req.file){
           file_path= await req.file.save('./public/uploads')
           req.body.recipet_img = file_path.split('uploads/')[1]
        }

        const result = await conn.sale_order.create(req.body)
        const order_details = JSON.parse(req.body.order_details);
        console.log("body", req.body);
        
        order_details.forEach(element => {
            element.sale_order_id = result.id;
        });
        
        await conn.sale_order_details.bulkCreate(order_details);
        result["order_details"] = order_details;
        res.status(200).json({ status: true, data: result });
    }
    catch (e)
    {
        console.log(e);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }


}

exports.pagination = async (req, res, next) =>
{
    try
    {
        var offset = (req.query.page - 1) * req.query.limit
        console.log("the offset", offset, "the limit is ", req.query.limit);
        var result = await conn.sale_order.findAll({
            order: [["id", "DESC"]],
            include: [],
            offset: offset,
            limit: req.query.limit,
            subQuery: false,
        })
        console.log("the len is", result.length)
    
            var count = await conn.sale_order.count();
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
exports.getSalesOrderById = async (req, res, next) =>
{
    try
    {
        const result = await conn.sale_order.findOne({ where: { id: req.params.id } })
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
exports.updateSalesOrder = async (req, res, next) =>
{
    try
    {
        const isUpdated = await conn.sale_order.update(req.body, { where: { id: req.params.id } })
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


//@decs   Get All 
//@route  Delete
//@access Public
exports.deleteSalesOrder = async (req, res, next) =>
{
    try
    {
        const isDeleted = await conn.sale_order.destroy({ where: { id: req.params.id } })
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


