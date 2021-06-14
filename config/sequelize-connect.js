const Sequelize = require('sequelize');
const path = require('path');
const AllModels = require('../models');
const { DB_CONNECTION_SUCCESSFUL, DB_CONNECTION_UNSUCCESSFUL } = require('../helpers/messages');

let sequelize;

exports.dbConnect = async () => {
  const env = process.env.NODE_ENV || 'development';
  let config = require(path.join(__dirname, '../config/config.js'))[env];
  if (!config) config = require(path.join(__dirname, '../config/config.js')).development;

  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  sequelize.authenticate().then(() => {
    console.info(DB_CONNECTION_SUCCESSFUL);
  }).catch((err) => {
    console.error(DB_CONNECTION_UNSUCCESSFUL, err.message);
  });
};

exports.dbDisconnect = async () => {
  await AllModels.sequelize.close();
};
