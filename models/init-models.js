var DataTypes = require("sequelize").DataTypes;
var _accounting_peroids = require("./accounting_peroids");
var _categories = require("./categories");
var _customer_categories = require("./customer_categories");
var _customers = require("./customers");
var _level_one_chart_of_accounts = require("./level_one_chart_of_accounts");
var _level_three_chart_of_accounts = require("./level_three_chart_of_accounts");
var _level_two_chart_of_accounts = require("./level_two_chart_of_accounts");
var _main_chart_of_accounts_types = require("./main_chart_of_accounts_types");
var _product_customer_categories = require("./product_customer_categories");
var _product_logs = require("./product_logs");
var _products = require("./products");
var _sale_credit_note_details = require("./sale_credit_note_details");
var _sale_credit_notes = require("./sale_credit_notes");
var _sale_order = require("./sale_order");
var _sale_order_details = require("./sale_order_details");
var _subledger = require("./subledger");
var _subledger_account_subaccounts = require("./subledger_account_subaccounts");
var _subledger_accounts = require("./subledger_accounts");
var _subledger_parent_accounts = require("./subledger_parent_accounts");
var _subledger_transactions = require("./subledger_transactions");
var _transaction_details = require("./transaction_details");
var _transaction_documents = require("./transaction_documents");
var _transactions = require("./transactions");
var _users = require("./users");

function initModels(sequelize) {
  var accounting_peroids = _accounting_peroids(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var customer_categories = _customer_categories(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var level_one_chart_of_accounts = _level_one_chart_of_accounts(sequelize, DataTypes);
  var level_three_chart_of_accounts = _level_three_chart_of_accounts(sequelize, DataTypes);
  var level_two_chart_of_accounts = _level_two_chart_of_accounts(sequelize, DataTypes);
  var main_chart_of_accounts_types = _main_chart_of_accounts_types(sequelize, DataTypes);
  var product_customer_categories = _product_customer_categories(sequelize, DataTypes);
  var product_logs = _product_logs(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var sale_credit_note_details = _sale_credit_note_details(sequelize, DataTypes);
  var sale_credit_notes = _sale_credit_notes(sequelize, DataTypes);
  var sale_order = _sale_order(sequelize, DataTypes);
  var sale_order_details = _sale_order_details(sequelize, DataTypes);
  var subledger = _subledger(sequelize, DataTypes);
  var subledger_account_subaccounts = _subledger_account_subaccounts(sequelize, DataTypes);
  var subledger_accounts = _subledger_accounts(sequelize, DataTypes);
  var subledger_parent_accounts = _subledger_parent_accounts(sequelize, DataTypes);
  var subledger_transactions = _subledger_transactions(sequelize, DataTypes);
  var transaction_details = _transaction_details(sequelize, DataTypes);
  var transaction_documents = _transaction_documents(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  subledger_transactions.belongsTo(accounting_peroids, { as: "accounting_period", foreignKey: "accounting_period_id"});
  accounting_peroids.hasMany(subledger_transactions, { as: "subledger_transactions", foreignKey: "accounting_period_id"});
  transactions.belongsTo(accounting_peroids, { as: "accounting_period", foreignKey: "accounting_period_id"});
  accounting_peroids.hasMany(transactions, { as: "transactions", foreignKey: "accounting_period_id"});
  products.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(products, { as: "products", foreignKey: "category_id"});
  customers.belongsTo(customer_categories, { as: "customer_category", foreignKey: "customer_category_id"});
  customer_categories.hasMany(customers, { as: "customers", foreignKey: "customer_category_id"});
  sale_order.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(sale_order, { as: "sale_orders", foreignKey: "customer_id"});
  level_two_chart_of_accounts.belongsTo(level_one_chart_of_accounts, { as: "level_one_chart_of_account", foreignKey: "level_one_chart_of_account_id"});
  level_one_chart_of_accounts.hasMany(level_two_chart_of_accounts, { as: "level_two_chart_of_accounts", foreignKey: "level_one_chart_of_account_id"});
  subledger_account_subaccounts.belongsTo(level_three_chart_of_accounts, { as: "level_three_chart_of_account", foreignKey: "level_three_chart_of_account_id"});
  level_three_chart_of_accounts.hasMany(subledger_account_subaccounts, { as: "subledger_account_subaccounts", foreignKey: "level_three_chart_of_account_id"});
  transaction_details.belongsTo(level_three_chart_of_accounts, { as: "account", foreignKey: "account_id"});
  level_three_chart_of_accounts.hasMany(transaction_details, { as: "transaction_details", foreignKey: "account_id"});
  level_three_chart_of_accounts.belongsTo(level_two_chart_of_accounts, { as: "level_two_chart_of_account", foreignKey: "level_two_chart_of_account_id"});
  level_two_chart_of_accounts.hasMany(level_three_chart_of_accounts, { as: "level_three_chart_of_accounts", foreignKey: "level_two_chart_of_account_id"});
  subledger_parent_accounts.belongsTo(level_two_chart_of_accounts, { as: "level_two_chart_of_account", foreignKey: "level_two_chart_of_account_id"});
  level_two_chart_of_accounts.hasMany(subledger_parent_accounts, { as: "subledger_parent_accounts", foreignKey: "level_two_chart_of_account_id"});
  level_one_chart_of_accounts.belongsTo(main_chart_of_accounts_types, { as: "main_chart_of_accounts_type", foreignKey: "main_chart_of_accounts_type_id"});
  main_chart_of_accounts_types.hasMany(level_one_chart_of_accounts, { as: "level_one_chart_of_accounts", foreignKey: "main_chart_of_accounts_type_id"});
  product_customer_categories.belongsTo(product_customer_categories, { as: "customer_category", foreignKey: "customer_category_id"});
  product_customer_categories.hasMany(product_customer_categories, { as: "product_customer_categories", foreignKey: "customer_category_id"});
  product_customer_categories.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_customer_categories, { as: "product_customer_categories", foreignKey: "product_id"});
  product_logs.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_logs, { as: "product_logs", foreignKey: "product_id"});
  sale_order_details.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(sale_order_details, { as: "sale_order_details", foreignKey: "product_id"});
  sale_order_details.belongsTo(sale_order, { as: "sale_order", foreignKey: "sale_order_id"});
  sale_order.hasMany(sale_order_details, { as: "sale_order_details", foreignKey: "sale_order_id"});
  subledger_accounts.belongsTo(subledger, { as: "subledger", foreignKey: "subledger_id"});
  subledger.hasMany(subledger_accounts, { as: "subledger_accounts", foreignKey: "subledger_id"});
  subledger_parent_accounts.belongsTo(subledger, { as: "subledger", foreignKey: "subledger_id"});
  subledger.hasMany(subledger_parent_accounts, { as: "subledger_parent_accounts", foreignKey: "subledger_id"});
  subledger_transactions.belongsTo(subledger_account_subaccounts, { as: "subledger_subaccount", foreignKey: "subledger_subaccounts_id"});
  subledger_account_subaccounts.hasMany(subledger_transactions, { as: "subledger_transactions", foreignKey: "subledger_subaccounts_id"});
  subledger_account_subaccounts.belongsTo(subledger_accounts, { as: "subledger_account", foreignKey: "subledger_account_id"});
  subledger_accounts.hasMany(subledger_account_subaccounts, { as: "subledger_account_subaccounts", foreignKey: "subledger_account_id"});
  subledger_transactions.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(subledger_transactions, { as: "subledger_transactions", foreignKey: "transaction_id"});
  transaction_details.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(transaction_details, { as: "transaction_details", foreignKey: "transaction_id"});
  transaction_documents.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(transaction_documents, { as: "transaction_documents", foreignKey: "transaction_id"});
  sale_order.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(sale_order, { as: "sale_orders", foreignKey: "user_id"});

  return {
    accounting_peroids,
    categories,
    customer_categories,
    customers,
    level_one_chart_of_accounts,
    level_three_chart_of_accounts,
    level_two_chart_of_accounts,
    main_chart_of_accounts_types,
    product_customer_categories,
    product_logs,
    products,
    sale_credit_note_details,
    sale_credit_notes,
    sale_order,
    sale_order_details,
    subledger,
    subledger_account_subaccounts,
    subledger_accounts,
    subledger_parent_accounts,
    subledger_transactions,
    transaction_details,
    transaction_documents,
    transactions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
