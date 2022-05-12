import JWT from 'jsonwebtoken';

import { JWT_CONFIG } from '../configs';

export const getUserId = (token: string): number | undefined => {
  try {
    const { id } = JWT.verify(token.slice(7, token.length).trim(), JWT_CONFIG.secret) as {
      id: number;
    };

    return id;
  } catch (error) {
    return undefined;
  }
};
