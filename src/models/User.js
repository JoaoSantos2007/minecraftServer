import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../../config/sequelize.js';

class User extends Model { }

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gamertag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  quota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'User',
  sequelize: db,
  timestamps: false,
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
});

export default User;
