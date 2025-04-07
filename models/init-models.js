var DataTypes = require("sequelize").DataTypes;
var _categories = require("./categories");
var _product_logs = require("./product_logs");
var _products = require("./products");
var _sale_credit_note_details = require("./sale_credit_note_details");
var _sale_credit_notes = require("./sale_credit_notes");
var _sale_order = require("./sale_order");
var _sale_order_details = require("./sale_order_details");
var _users = require("./users");

function initModels(sequelize) {
  var categories = _categories(sequelize, DataTypes);
  var product_logs = _product_logs(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var sale_credit_note_details = _sale_credit_note_details(sequelize, DataTypes);
  var sale_credit_notes = _sale_credit_notes(sequelize, DataTypes);
  var sale_order = _sale_order(sequelize, DataTypes);
  var sale_order_details = _sale_order_details(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  products.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(products, { as: "products", foreignKey: "category_id"});
  product_logs.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_logs, { as: "product_logs", foreignKey: "product_id"});
  sale_order_details.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(sale_order_details, { as: "sale_order_details", foreignKey: "product_id"});
  sale_order_details.belongsTo(sale_order, { as: "sale_order", foreignKey: "sale_order_id"});
  sale_order.hasMany(sale_order_details, { as: "sale_order_details", foreignKey: "sale_order_id"});
  sale_order.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(sale_order, { as: "sale_orders", foreignKey: "user_id"});

  return {
    categories,
    product_logs,
    products,
    sale_credit_note_details,
    sale_credit_notes,
    sale_order,
    sale_order_details,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
