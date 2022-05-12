import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IRequest extends Request {
  token: string;
  user: JwtPayload;
}

export type IResponse = Response;

export type INext = NextFunction;
