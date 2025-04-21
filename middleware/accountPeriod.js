const { conn, sequelize } = require("../db/conn");
var authenticate = async (req, res, next) => {
  const url = req.originalUrl;
  console.log("--------------", url);
  if (req.method == "POST" || req.method == "PUT") {
    var name = url.split("api/")[1];
    if (url == "/api/users/login") return next();

    if (!req.body?.accounting_period_id) {
      var result = await conn.accounting_peroids.findAll({
        order: [["id", "DESC"]],
        limit: 1
      });
      if (result) {
        req.body.accounting_period_id = result[0]?.id;
        console.log("--------------------", name);
        console.log("--------------------", result[0].id);
        if(req.method =='POST')
          console.log('body :',JSON.stringify(req.body,null,2));
          
      }
    }
    next();
  } else {
    next();
  }
  //   next();
};
module.exports = authenticate;