import Keyv from 'keyv';

const keyv = new Keyv();

export const cache = {
  set: (key: string, value: string, ttl = 0) => keyv.set(key, value, ttl),
  get: (key: string) => keyv.get(key),
  del: (key: string) => keyv.delete(key),
};
