import * as express from 'express';
import * as jwt from 'jsonwebtoken'

interface JwtPayload extends jwt.JwtPayload {}

declare global {
  namespace Express {
    interface Request {
      [key: string]: string;
      user: JwtPayload;
      token: string;
    }
  }
}
