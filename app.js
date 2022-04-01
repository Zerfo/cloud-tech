const cookieParser = require('cookie-parser');
const cors = require("cors");
const express = require('express');
const logger = require('morgan');
const path = require('path');

require('dotenv').config();

const corsOptionsDelegate = require('./utils/cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger('dev'));

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
  require('./models/connection');
});
