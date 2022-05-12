import { IRequest, IResponse, INext } from '../interfaces/vendors';
import { jwt, cache } from '../utils';

export const authMiddleware = async (req: IRequest, res: IResponse, next: INext) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    try {
      token = token.trim();

      const isBlackListed = await cache.get(token);

      if (isBlackListed) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = await jwt.verifyToken(token);

      // @ts-ignore
      req.user = decoded;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    return res.status(400).json({ error: 'Authorization header is missing.' });
  }
};
