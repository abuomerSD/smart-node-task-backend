const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subledger_parent_accounts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subledger_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subledger',
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
    level_two_chart_of_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'level_two_chart_of_accounts',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(10),
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
    tableName: 'subledger_parent_accounts',
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
        name: "fk_subledger_accounts_subledger_2",
        using: "BTREE",
        fields: [
          { name: "subledger_id" },
        ]
      },
      {
        name: "level_two_chart_of_account_id",
        using: "BTREE",
        fields: [
          { name: "level_two_chart_of_account_id" },
        ]
      },
    ]
  });
};
