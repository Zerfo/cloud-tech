import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

import { JWT_CONFIG } from '../configs';

export const roleMiddleware =
  (availableRole: string | string[]) => async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      try {
        token = token.trim();

        const { role } = (await JWT.verify(token, JWT_CONFIG.secret)) as { role: string };

        if (role === availableRole) {
          next();
        }

        throw new Error('Access is denied');
      } catch (error) {
        return res.status(401).json({ error: 'Access is denied' });
      }
    } else {
      return res.status(400).json({ error: 'Authorization header is missing.' });
    }
  };
