const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    currency_rate: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'level_three_chart_of_accounts',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    value_in_other_currency: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    transaction_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "normal"
    },
    descr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descr_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    posted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'transaction_details',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "mian_transation_details",
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
        ]
      },
      {
        name: "level_three_accont",
        using: "BTREE",
        fields: [
          { name: "account_id" },
        ]
      },
    ]
  });
};
