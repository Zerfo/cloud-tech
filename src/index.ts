import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { corsOptionsDelegate, app, httpServer } from './utils';
import { connection } from './models';
import { SERVER_CONFIG } from './configs';
import router from './routes';

import path from 'path';

dotenv.config();

const { APP_PORT } = SERVER_CONFIG;
const { SOCKET_PORT } = SERVER_CONFIG;

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

try {
  connection.authenticate();
  connection.sync({ alter: true });
  console.log('Connection has been established successfully.');
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

app.listen(APP_PORT, () => {
  console.log(`Running on port ${APP_PORT}`);
});
httpServer.listen(SOCKET_PORT);
