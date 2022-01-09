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
