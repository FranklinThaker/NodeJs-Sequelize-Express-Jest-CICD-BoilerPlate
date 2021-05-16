/* eslint-disable no-unused-vars */

const { errorResponse } = require('../helpers/helpers');

exports.errorHandler = (err, req, res, next) => errorResponse(req, res, err.message);
