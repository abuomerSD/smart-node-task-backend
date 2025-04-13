
const { conn, sequelize } = require('../../db/conn');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { response } = require('../../server');

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
        if (req.file)
        {
            file_path = await req.file.save('./public/uploads')
            req.body.recipet_img = file_path.split('uploads/')[1]
        }

        const result = await conn.sale_order.create(req.body);
        const order_details = JSON.parse(req.body.order_details);
        console.log("body", req.body);

        order_details.forEach(element =>
        {
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
        // var result = await conn.sale_order.findAll({
        //     order: [["id", "DESC"]],
        //     include: [{ model: conn.sale_order_details, as: 'sale_order_details', include: ['product'] }],
        //     offset: offset,
        //     limit: req.query.limit,
        //     subQuery: false,
        // })

        var result = await sequelize.query(`
            SELECT *, (SELECT JSON_ARRAYAGG(JSON_Object('id', id, 'sale_order_id', sale_order_id, 'qty', sale_order_details.qty - (SELECT COALESCE(SUM(sale_credit_note_details.qty), 0) FROM sale_credit_note_details WHERE sale_credit_note_details.sale_order_detail_id = sale_order_details.id) , 'product_id', product_id, 'price', price , 'product', (SELECT json_object('name', name, 'img', img) FROM products WHERE products.id = product_id))) FROM sale_order_details WHERE sale_order_id = sale_order.id) AS sale_order_details FROM sale_order limit ${req.query.limit} OFFSET ${offset}
            `)

        var count = await conn.sale_order.count();
        res.status(200).json({ status: true, data: result[0], tot: count })

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
        console.log(e);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

//@decs   Get All 
//@route  GET
//@access Public
exports.getSalesOrderDetailsByOrderId = async (req, res, next) =>
{
    try
    {
        console.log("the order id", req.params.id);
        const result = await sequelize.query(`
                SELECT 
                    sale_order_details.id,
                    sale_order_details.sale_order_id,
                    (SELECT json_object('name',products.name, 'img', products.img) FROM products WHERE products.id = sale_order_details.product_id) AS product,
                    sale_order_details.price,
                    sale_order_details.qty - (SELECT COALESCE(SUM(sale_credit_note_details.qty), 0) FROM sale_credit_note_details WHERE sale_credit_note_details.sale_order_detail_id = sale_order_details.id) as qty
                    FROM sale_order_details
                    WHERE sale_order_details.sale_order_id =  ${req.params.id}
                `);
        console.log('query result', result);
        let data = {
            sale_order_details: result[0],
        }
        if (result.length != 0)
            res.status(200).json({ status: true, data });
        else
        {
            res.status(200).json({ status: false, msg: `No data founded` });
        }
    }
    catch (e)
    {
        console.log(e);
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

exports.getSalesDataOfLastWeek = async (req, res, next) =>
{
    try
    {
        const response = await sequelize.query(`
                select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT COUNT(sale_order.id) FROM sale_order WHERE  date(sale_order.created) =selected_date GROUP BY DATE_FORMAT(sale_order.created,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 week)) and CURRENT_DATE()) tmp
            `);
        let options = {};
        let series = response[0].map((item) =>
        {
            return {
                x: item.label,
                y: item.y
            }
        })
        res.status(200).json({ status: true, data: { series } });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getSalesDataOfLastYear = async (req, res, next) =>
{
    try
    {
        const response = await sequelize.query(`
           select v label,(SELECT COUNT(sale_order.id) FROM sale_order WHERE  DATE_FORMAT(sale_order.created,"%Y-%m") =v GROUP BY DATE_FORMAT(sale_order.created,"%Y-%m")) y  from(select DISTINCT DATE_FORMAT(selected_date,"%Y-%m") v from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where DATE_FORMAT(selected_date,"%Y-%m") between DATE_FORMAT((date_sub(now(),interval 1 year)),"%Y-%m") and DATE_FORMAT(now(),"%Y-%m")) tmp2
        `);
        let options = {};
        let series = response[0].map((item) =>
        {
            return {
                x: item.label,
                y: item.y
            }
        })
        res.status(200).json({ status: true, data: { series } });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getSalesDataOfLastMonthByProductId = async (req, res, next) =>
{
    try
    {
        const product_id = req.params.product_id;
        const response = await sequelize.query(`
            select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT SUM(sale_order_details.qty) FROM sale_order_details WHERE  date(sale_order_details.created) =selected_date AND sale_order_details.product_id = ${product_id} GROUP BY DATE_FORMAT(sale_order_details.created,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 month)) and CURRENT_DATE()) tmp


        `);


        let options = {};
        let series = response[0].map((item) =>
        {
            return {
                x: item.label,
                y: item.y
            }
        })
        console.log(series);
        res.status(200).json({ status: true, data: { series } });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getBestSellingProductsLastDay = async (req, res, next) =>
{
    try
    {
        const data = await sequelize.query(`
                SELECT p.name AS product_name,p.img AS img, s.product_id, SUM(s.qty) AS total_sold FROM sale_order_details s JOIN products p ON s.product_id = p.id WHERE s.created >= NOW() - INTERVAL 1 DAY GROUP BY s.product_id, p.name ORDER BY total_sold DESC LIMIT 10
            `);
        res.status(200).json({ status: true, data: data[0] });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getBestSellingProductsLastWeek = async (req, res, next) =>
{
    try
    {
        const data = await sequelize.query(`
            SELECT p.name AS product_name,p.img AS img, s.product_id, SUM(s.qty) AS total_sold FROM sale_order_details s JOIN products p ON s.product_id = p.id WHERE s.created >= NOW() - INTERVAL 1 WEEK GROUP BY s.product_id, p.name ORDER BY total_sold DESC LIMIT 10
        `);
        res.status(200).json({ status: true, data: data[0] });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getBestSellingProductsLastMonth = async (req, res, next) =>
{
    try
    {
        const data = await sequelize.query(`
            SELECT p.name AS product_name,p.img AS img, s.product_id, SUM(s.qty) AS total_sold FROM sale_order_details s JOIN products p ON s.product_id = p.id WHERE s.created >= NOW() - INTERVAL 1 MONTH GROUP BY s.product_id, p.name ORDER BY total_sold DESC LIMIT 10
        `);
        res.status(200).json({ status: true, data: data[0] });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getBestSellingProductsLastYear = async (req, res, next) =>
{
    try
    {
        const data = await sequelize.query(`
            SELECT p.name AS product_name,p.img AS img, s.product_id, SUM(s.qty) AS total_sold FROM sale_order_details s JOIN products p ON s.product_id = p.id WHERE s.created >= NOW() - INTERVAL 1 YEAR GROUP BY s.product_id, p.name ORDER BY total_sold DESC LIMIT 10
        `);
        res.status(200).json({ status: true, data: data[0] });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
}

exports.getSalesDataOfLastWeekByProductId = async (req, res, next) =>
{
    try
    {
        const id = req.params.product_id;
        const data = await sequelize.query(`
                select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT sum(sale_order_details.qty) FROM sale_order_details WHERE  sale_order_details.product_id = ${id} AND date(sale_order_details.created) =selected_date GROUP BY DATE_FORMAT(sale_order_details.created,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 week)) and CURRENT_DATE()) tmp
            `);
            let series = data[0].map((item) =>
            {
                return {
                    x: item.label,
                    y: item.y
                }
            })
            console.log(series);
            res.status(200).json({ status: true, data: { series } });
    } catch (error)
    {
        console.log(error);
        res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
    }
} 