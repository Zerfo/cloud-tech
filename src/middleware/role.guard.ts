import { Request, Response, NextFunction } from 'express';

import { getUserRole } from '../utils';

export const roleMiddleware =
  (availableRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      try {
        const role = getUserRole(token);

        if (availableRole?.some((r) => r === role)) {
          next(role);
        }

        throw new Error('Access is denied');
      } catch (error) {
        return res.status(401).json({ error: 'Access is denied' });
      }
    } else {
      return res.status(400).json({ error: 'Authorization header is missing.' });
    }
  };
