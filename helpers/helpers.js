const jwt = require('jsonwebtoken');
const SimpleCrypto = require('simple-crypto-js').default;
const crypto = require('crypto');

const JWT_TOKEN_EXPIRATION_TIME = '7d';

const {
  SOMETHING_WENT_WRONG,
  OPERATION_COMPLETED,
} = require('./messages');

exports.successResponse = (req, res, data, message = OPERATION_COMPLETED, code = 200) => {
  res.status(code);
  res.send({
    code,
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (req, res, message = SOMETHING_WENT_WRONG, code = 500) => {
  res.status(code);
  res.send({
    code,
    success: false,
    message,
    data: null,
  });
};

exports.generateJWTtoken = (object, secretKey = process.env.SECRET) => jwt.sign(JSON.parse(JSON.stringify(object)), secretKey, { expiresIn: JWT_TOKEN_EXPIRATION_TIME });

exports.decrypt = (text) => {
  const simpleCrypto = new SimpleCrypto(process.env.ENCRYPTION_KEY);
  const chiperText = simpleCrypto.decrypt(text);
  return chiperText;
};

exports.encrypt = (text) => {
  const simpleCrypto = new SimpleCrypto(process.env.ENCRYPTION_KEY);
  const chiperText = simpleCrypto.encrypt(text);
  return chiperText;
};

exports.comparePassword = (paramPass, dbPass) => {
  const password = crypto
    .createHash('md5')
    .update(paramPass)
    .digest('hex');

  if (password === dbPass) {
    return true;
  }
  return false;
};
