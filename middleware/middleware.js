require('dotenv').config();

const jwt = require('jsonwebtoken');
const path = require('path');
const csv = require('csvtojson');

const {
  errorResponse,
  decrypt,
} = require('../helpers/helpers');

const {
  NO_TOKEN_PROVIDED,
  TOKEN_EXPIRED,
  USER_NOT_EXIST,
  USER_ACC_DISABLED,
  YOU_ARE_NOT_AUTHORIZED,
} = require('../helpers/messages');

const {
  UsersModel,
} = require('../models');

const authorizationData = [];

exports.authentication = async (req, res, next) => {
  let decoded;

  if (!(req.headers && req.headers.authorization)) {
    return errorResponse(req, res, NO_TOKEN_PROVIDED, 401);
  }

  const encryptedToken = req.headers.authorization;

  try {
    const decryptedToken = decrypt(encryptedToken);
    decoded = jwt.decode(decryptedToken);
    jwt.verify(decryptedToken, process.env.SECRET);
  } catch (error) {
    if (error.message === 'jwt expired') {
      return errorResponse(req, res, TOKEN_EXPIRED, 401);
    }
    return errorResponse(req, res, error.message, 401);
  }

  const data = await UsersModel.findOne({ where: { id: decoded.id } });
  if (!data) return errorResponse(req, res, USER_NOT_EXIST, 401);
  if (!data.status) return errorResponse(req, res, USER_ACC_DISABLED, 401);

  req.user = data;

  res.locals.ROLE = data.role;
  res.locals.METHOD = req.method;
  res.locals.URL = req.url;

  return next();
};

exports.authorization = async (req, res, next) => {
  for (let i = 0; i < authorizationData.length; i += 1) {
    if (authorizationData[i].role === res.locals.ROLE) {
      if (authorizationData[i].method === res.locals.METHOD) {
        const requestURL = req.originalUrl;
        const systemURL = req.baseUrl + req.route.path;
        const policyURL = authorizationData[i].url;

        if (requestURL === systemURL && systemURL === policyURL) {
          return next();
        }

        const lastSegmentRequestURL = requestURL.substring(requestURL.lastIndexOf('/') + 1);
        const lastSegmentSystemURL = systemURL.substring(systemURL.lastIndexOf('/') + 1);
        const lastSegmentPolicyURL = policyURL.substring(policyURL.lastIndexOf('/') + 1);

        if (lastSegmentRequestURL && lastSegmentSystemURL === lastSegmentPolicyURL) {
          return next();
        }
      } else if (authorizationData[i].method === '*') {
        const requestURL = req.originalUrl;
        const systemURL = req.baseUrl + req.route.path;
        const policyURL = authorizationData[i].url;

        if (requestURL === systemURL && systemURL === policyURL) {
          return next();
        }

        const lastSegmentRequestURL = requestURL.substring(requestURL.lastIndexOf('/') + 1);
        const lastSegmentSystemURL = systemURL.substring(systemURL.lastIndexOf('/') + 1);
        const lastSegmentPolicyURL = policyURL.substring(policyURL.lastIndexOf('/') + 1);

        if (lastSegmentRequestURL && lastSegmentSystemURL === lastSegmentPolicyURL) {
          return next();
        }
      }
    }
  }
  return errorResponse(req, res, YOU_ARE_NOT_AUTHORIZED, 401);
};

exports.getROLES = async () => {
  const csvPath = path.resolve(path.join(__dirname, 'policy.csv'));

  await csv()
    .fromFile(csvPath)
    .then((jsonObj) => {
      authorizationData.push(...jsonObj);
    });
};
