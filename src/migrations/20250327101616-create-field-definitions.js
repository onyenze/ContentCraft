'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('field_definitions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      identifier: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      dataType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contentTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'content_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('field_definitions');
  }
};
