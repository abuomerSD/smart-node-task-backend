const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subledger_account_subaccounts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subledger_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subledger_accounts',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    level_three_chart_of_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'level_three_chart_of_accounts',
        key: 'id'
      }
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
    tableName: 'subledger_account_subaccounts',
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
        name: "subledger_account_id",
        using: "BTREE",
        fields: [
          { name: "subledger_account_id" },
        ]
      },
      {
        name: "level_three_chart_of_account_id",
        using: "BTREE",
        fields: [
          { name: "level_three_chart_of_account_id" },
        ]
      },
    ]
  });
};
