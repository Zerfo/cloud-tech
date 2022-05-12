import {Request, Response, NextFunction} from 'express';
import {JwtPayload} from 'jsonwebtoken';

export interface IRequest extends Request {
  token: string;
  user: JwtPayload;
}

export interface IResponse extends Response {}

export interface INext extends NextFunction {}
