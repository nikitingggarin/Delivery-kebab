const {
  Model,
} = require('sequelize');
const orders = require('./orders');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders }) {
      this.hasMany(Orders, { foreignKey: 'customer_id' });
      this.hasMany(Orders, { foreignKey: 'courier_id' });
    }
  }
  Users.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    login: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_user: {
      type: DataTypes.ENUM(['customer', 'courier']),
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
  });
  return Users;
};
