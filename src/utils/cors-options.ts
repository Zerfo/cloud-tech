import {Request} from 'express';

const allowlist = ['*', 'http://localhost:8080', 'http://localhost:3000'];

export const corsOptionsDelegate = (req: Request, callback: Function) => {
  let corsOptions;

  // @ts-ignore
  const isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

  if (isDomainAllowed) {
    corsOptions = {origin: true, optionsSuccessStatus: 200};
  } else {
    corsOptions = {origin: false};
  }
  callback(null, corsOptions);
};
