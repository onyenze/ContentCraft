'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('content_items', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  contentTypeIdentifier: {
          type: Sequelize.STRING,
          allowNull: false,
        },
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  publishedAt: Sequelize.DATE,
  status: {
    type: Sequelize.ENUM('DRAFT', 'REVIEW', 'PUBLISHED'),
    allowNull: false,
  },
  data: Sequelize.JSON,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});
},
async down(queryInterface, Sequelize) {
  await queryInterface.dropTable('content_items');
}
};
