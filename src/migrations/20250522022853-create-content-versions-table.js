// migrations/XXXXXXXXXXXXXX-create-content-versions-table.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('content_versions', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      contentItemId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'content_items',
          key: 'id'
        }
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false
      },
      isCurrent: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
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

    await queryInterface.addIndex('content_versions', ['contentItemId']);
    await queryInterface.addIndex('content_versions', ['isCurrent']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('content_versions');
  }
};