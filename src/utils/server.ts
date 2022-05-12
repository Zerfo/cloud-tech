import { Server } from 'socket.io';

import express from 'express';

import { createServer } from 'http';

export const app = express();

export const httpServer = createServer(app);

export const socket = new Server(httpServer);

export const emitMessage = (roles: string[], type: string, data: object) => {
  socket.emit(type, {
    roles,
    data,
  });
};
