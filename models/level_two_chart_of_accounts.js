const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('level_two_chart_of_accounts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    level_one_chart_of_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'level_one_chart_of_accounts',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_editable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING(200),
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
    tableName: 'level_two_chart_of_accounts',
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
        name: "fk_level_two_chart_of_accounts_level_one_chart_of_accounts_1",
        using: "BTREE",
        fields: [
          { name: "level_one_chart_of_account_id" },
        ]
      },
    ]
  });
};
