import JWT from 'jsonwebtoken';

import { JWT_CONFIG } from '../configs';

export const jwt = {
  verifyToken: (token: string) => JWT.verify(token, JWT_CONFIG.secret),
  createToken: (data: object) => JWT.sign(data, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.ttl }),
};
