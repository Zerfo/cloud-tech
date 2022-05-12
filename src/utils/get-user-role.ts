import JWT from 'jsonwebtoken';

import { JWT_CONFIG } from '../configs';

export const getUserRole = (token: string): string | undefined => {
  try {
    const { role } = JWT.verify(token.slice(7, token.length).trim(), JWT_CONFIG.secret) as {
      role: string;
    };

    return role;
  } catch (error) {
    return undefined;
  }
};
