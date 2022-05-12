import bcrypt from 'bcrypt';

import { USER_MODEL } from '../models';
import { jwt, cache, emitMessage } from '../utils';
import { JWT_CONFIG } from '../configs';
import { ROLE_ADMIN } from '../constants';
import { IRequest, IResponse } from '../interfaces/vendors';

export class AuthController {
  static async register(role: string, req: IRequest, res: IResponse) {
    await USER_MODEL.sync();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await USER_MODEL.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashedPassword,
      role: req.body.role,
      username: req.body.username,
    });

    const newUser = { ...user };
    delete newUser.password;

    emitMessage([ROLE_ADMIN], null, 'new-user', newUser);

    return res.status(200).json(newUser);
  }

  static async login(req: IRequest, res: IResponse) {
    await USER_MODEL.sync();

    const user = await USER_MODEL.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      const isMatched = await bcrypt.compare(req.body.password, user.password);

      if (isMatched) {
        const token = await jwt.createToken({ id: user.id, role: user.role });

        return res.status(200).json({
          access_token: token,
          token_type: 'Bearer',
          expires_in: JWT_CONFIG.ttl,
        });
      }
    }

    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async changePassword(req: IRequest, res: IResponse) {
    await USER_MODEL.sync();

    const user = await USER_MODEL.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      const isMatched = await bcrypt.compare(req.body.old_password, user.password);

      if (isMatched) {
        const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
        const token = await jwt.createToken({ id: user.id, role: user.role });

        user.update({
          password: hashedPassword,
        });

        return res.status(200).json({
          access_token: token,
          token_type: 'Bearer',
          expires_in: JWT_CONFIG.ttl,
        });
      }
    }

    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getUser(req: IRequest, res: IResponse) {
    await USER_MODEL.sync();

    const user = await USER_MODEL.findByPk(req.params.id);

    return res.status(200).json(user);
  }

  static async getUsers(role: string, req: IRequest, res: IResponse) {
    await USER_MODEL.sync();

    const users = await USER_MODEL.findAll();

    return res.status(200).json(users);
  }

  static async logout(req: IRequest, res: IResponse) {
    const { token } = req;
    const now = new Date();
    const expire = new Date(req.user.exp || '');
    const milliseconds = now.getTime() - expire.getTime();

    await cache.set(token, token, milliseconds);

    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
