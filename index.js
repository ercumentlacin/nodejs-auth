const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const { errorHandler, notFound } = require('./utils');

// middleware
app.use(morgan('common'));
app.use(express.json());

// mongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => console.log('Connected to MongoDB'),
  (err) => errorHandler(err),
);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

// routes
app.use('/api/v1/auth', require('./auth'));

// error handler
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
