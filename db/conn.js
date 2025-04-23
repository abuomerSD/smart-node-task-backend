const Sequelize = require("sequelize");
const initModels = require("../models/init-models.js");
const sequelize = new Sequelize("pos_demo", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
const conn = initModels(sequelize);
module.exports = { conn, sequelize };
