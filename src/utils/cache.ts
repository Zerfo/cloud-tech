import Keyv from 'keyv';

const keyv = new Keyv();

export const cache = {
  set: (key: string | any, value: string | any, ttl = 0) => {
    return keyv.set(key, value, ttl);
  },
  get: (key: string) => keyv.get(key),
  del: (key: string) => keyv.delete(key),
};
