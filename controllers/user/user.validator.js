const {
  errorResponse,
} = require('../../helpers/helpers');

const {
  INVALID_PARAMS,
} = require('../../helpers/messages');

exports.registerValidator = async (req, res, next) => {
  const param = { ...req.body, ...req.params, ...req.query };

  let failed = false;

  const allowedParams = ['name', 'email', 'role', 'password', 'status'];
  const requiredParams = ['name', 'email', 'role', 'password'];

  Object.keys(param).forEach((element) => {
    if (!allowedParams.includes(element)) failed = true;
  });

  requiredParams.forEach((element) => {
    if (!param[element]) failed = true;
  });

  if (failed) return errorResponse(req, res, INVALID_PARAMS, 400);
  return next();
};

exports.loginValidator = async (req, res, next) => {
  const param = { ...req.body, ...req.params, ...req.query };

  let failed = false;

  const allowedParams = ['email', 'password'];
  const requiredParams = allowedParams;

  Object.keys(param).forEach((element) => {
    if (!allowedParams.includes(element)) failed = true;
  });

  requiredParams.forEach((element) => {
    if (!param[element]) failed = true;
  });

  if (failed) return errorResponse(req, res, INVALID_PARAMS, 400);
  return next();
};
