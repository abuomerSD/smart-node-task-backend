const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('level_one_chart_of_accounts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    main_chart_of_accounts_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'main_chart_of_accounts_types',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    is_editable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
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
    tableName: 'level_one_chart_of_accounts',
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
        name: "fk_level_one_chart_of_accounts_main_chart_of_accounts_types_1",
        using: "BTREE",
        fields: [
          { name: "main_chart_of_accounts_type_id" },
        ]
      },
    ]
  });
};
