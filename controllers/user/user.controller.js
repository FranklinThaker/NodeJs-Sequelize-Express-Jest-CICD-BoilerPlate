const {
  UsersModel,
} = require('../../models');

const {
  successResponse,
  errorResponse,
  generateJWTtoken,
  encrypt,
  comparePassword,
} = require('../../helpers/helpers');

const {
  DATA_DOES_NOT_EXIST,
  INVALID_UNAME_PWORD,
  DATA_ALREADY_EXIST,
} = require('../../helpers/messages');

exports.register = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };

    const user = await UsersModel.findOne({ where: { email: param.email.toLowerCase() } });

    if (user) return errorResponse(req, res, DATA_ALREADY_EXIST, 400);

    const data = await UsersModel.create({
      name: param.name,
      email: param.email.toLowerCase(),
      password: param.password,
      status: param.status || true,
      role: param.role || 'user',
    });

    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };

    const user = await UsersModel.findOne({
      where: {
        email: param.email.toLowerCase(),
      },
    });

    if (!user) return errorResponse(req, res, INVALID_UNAME_PWORD, 401);

    const output = comparePassword(param.password, user.password);

    if (!output) return errorResponse(req, res, INVALID_UNAME_PWORD, 401);

    const encryptedToken = encrypt(generateJWTtoken({ id: user.id, role: user.role }));

    const data = {
      user,
      encryptedToken,
    };

    return successResponse(req, res, data);
  } catch (error) {
    console.log('🚀 TCL -> exports.login= -> error', error);
    return errorResponse(req, res, error.message);
  }
};

exports.findById = async (req, res) => {
  try {
    const param = { ...req.body, ...req.params, ...req.query };

    const user = await UsersModel.findOne({ where: { id: param.id } });

    if (!user) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 400);

    return successResponse(req, res, user);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.profile = async (req, res) => {
  try {
    const data = await UsersModel.findOne({ where: { id: req.user.id } });

    if (!data) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 400);

    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await UsersModel.findAll();

    if (!data) return errorResponse(req, res, DATA_DOES_NOT_EXIST, 400);

    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
