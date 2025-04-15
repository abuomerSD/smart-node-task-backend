const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subledger_transactions', {
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
    subledger_subaccounts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subledger_account_subaccounts',
        key: 'id'
      }
    },
    accounting_period_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'accounting_peroids',
        key: 'id'
      }
    },
    currency_rate: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    value_in_other_currency: {
      type: DataTypes.DECIMAL(30,3),
      allowNull: true
    },
    descr: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descr_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'subledger_transactions',
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
        name: "subledger_account_id_ofk",
        using: "BTREE",
        fields: [
          { name: "subledger_subaccounts_id" },
        ]
      },
      {
        name: "accounting_period_id",
        using: "BTREE",
        fields: [
          { name: "accounting_period_id" },
        ]
      },
      {
        name: "transaction_id",
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
        ]
      },
    ]
  });
};
