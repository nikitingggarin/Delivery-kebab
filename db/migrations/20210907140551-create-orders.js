module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      courier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      picture: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      original_price: {
        type: Sequelize.INTEGER,
      },
      discount_price: {
        type: Sequelize.INTEGER,
      },
      customer_location: {
        type: Sequelize.TEXT,
      },
      courier_location: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  },
};
