import {createServer} from "http";
import {Server} from "socket.io";
import express from 'express';

export const app = express();
export const httpServer = createServer(app);

export const socket = new Server(httpServer);

export const emitMessage = (roles: string[], type: string, data: object) => {
  socket.emit(type, {
    roles,
    data,
  });
};
