const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user.routes');
const { errorHandler } = require('./middleware/errorHandler');

const { TOO_MANY_REQUESTS } = require('./helpers/messages');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: TOO_MANY_REQUESTS,
  },
});

const app = express();

const { getROLES } = require('./middleware/middleware');

getROLES();

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(logger('common'));

app.use('/api/v1/account', apiLimiter, userRoutes);
app.use(errorHandler);

module.exports = app;
