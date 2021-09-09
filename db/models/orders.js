const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { as: 'customer', foreignKey: 'customer_id' });
      this.belongsTo(User, { as: 'courier', foreignKey: 'courier_id' });
    }
  }
  Orders.init({
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    courier_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picture: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    original_price: {
      type: DataTypes.STRING,
    },
    discount_price: {
      type: DataTypes.STRING,
    },
    customer_location: {
      type: DataTypes.TEXT,
    },
    courier_location: {
      type: DataTypes.TEXT,
    },
    take_order: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Orders',
  });
  return Orders;
};
