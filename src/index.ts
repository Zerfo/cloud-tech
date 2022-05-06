import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import {corsOptionsDelegate} from './utils';
import {USER_MODEL, REQ_PEOPLE_MODEL, REQ_CAR_MODEL, connection} from './models';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

try {
  connection.authenticate();
  connection.sync({alter: true});
  console.log('Connection has been established successfully.');
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
