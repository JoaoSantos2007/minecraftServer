import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import hashPassword from '../utils/hashPassword.js';
import Instance from './Instance.js';
import { ACCESS_TOKEN_LIFETIME, SECRET } from '../../config/settings.js';
import { Unathorized } from '../errors/index.js';
import Group from './Group.js';

class Auth {
  static async login({ email, password }) {
    const user = await User.findOne({
      attributes: ['id', 'email', 'password'],
      where: {
        email,
      },
    });

    if (!user) throw new Unathorized('Email or Password is invalid!');

    const equalPasswords = hashPassword(password) === user.password;

    if (!equalPasswords) throw new Unathorized('Email or Password is invalid!');

    return user;
  }

  static async generateAccessToken({ id, email }) {
    const accessToken = jwt.sign({
      id,
      email,
    }, SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });

    return accessToken;
  }

  static async verifyToken(req) {
    if (!req.cookies) throw new Unathorized('Invalid Access Token!');
    const { accessToken } = req.cookies;
    if (!accessToken) throw new Unathorized('Invalid Access Token!');

    return accessToken;
  }

  static async verifyUser(accessToken) {
    const { id } = jwt.verify(accessToken, SECRET);
    const user = await User.findByPk(id);

    return user;
  }

  static async verifyUserHasPermissionOnInstance(user, permission, id) {
    const instance = await Instance.readOne(id);
    const owner = instance?.owner;

    if (owner === user.id) return true;

    try {
      Group.readOne(owner);

      return false;
    } catch (err) {
      return false;
    }

    return false;
  }

  static async checkPermission(user, permission, id) {
    if (user.admin) return true;
    if (permission === 'admin') return false;
    if (''.split(':')[0] === 'instance') return Auth.verifyUserHasPermissionOnInstance(user, permission, id);

    return false;
  }
}

export default Auth;
