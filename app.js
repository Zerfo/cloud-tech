const cookieParser = require('cookie-parser');
const cors = require("cors");
const express = require('express');
const logger = require('morgan');
const path = require('path');

require('dotenv').config();

const router = require('./routes/index');
const sequelize = require('./models/connection');
const corsOptionsDelegate = require('./utils/cors');

const User = require('./models/user.model');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger('dev'));

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

try {
  sequelize.authenticate();
  User.sync({ force: true });
  console.log('Connection has been established successfully.');
} catch(err) {
  console.error('Unable to connect to the database:', error);
}

app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
