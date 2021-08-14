require('dotenv').config();

const https = require('https');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const chalk = require('chalk');
const sioRedis = require('socket.io-redis');

const { UsersModel } = require('./models');

const conn = require('./config/sequelize-connect');

conn.dbConnect();

const app = require('./app');

const key = fs.existsSync(`${__dirname}/certs/key.pem`) && fs.readFileSync(`${__dirname}/certs/key.pem`);
const cert = fs.existsSync(`${__dirname}/certs/cert.pem`) && fs.readFileSync(`${__dirname}/certs/cert.pem`);
let server;

if (key && cert) {
  server = https.createServer({ key, cert }, app);
} else {
  server = http.createServer(app);
}

const io = socketIO(server, {
  origin: [`${process.env.FRONT_END_URL}:*`, 'https://localhost:*'],
});

if (process.env.NODE_ENV !== 'test') {
  io.adapter(sioRedis({ host: 'localhost', port: 6379 }));
}

io.on('connection', (socket) => {
  socket.on('CLIENT_JOINED', async (data) => {
    console.info('TCL: data ->  ', data);
    const userData = await UsersModel.findOne({ where: { id: data.id } });
    if (userData) {
      socket.join(data.id);
    }
  });

  socket.on('disconnect', async () => {
    console.warn(socket.id, 'Got disconnect');
  });
});

process.on('message', (message, connection) => {
  if (message !== 'sticky-session:connection') return;
  server.emit('connection', connection);
  connection.resume();
});

process.on('uncaughtException', (uncaughtExc) => {
  console.error(chalk.bgRed('UNCAUGHT EXCEPTION! 💥 Shutting down...'));
  console.error('uncaughtException Err::', uncaughtExc);
  console.error('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(chalk.bgRed('UNHANDLED PROMISE REJECTION! 💥 Shutting down...'));
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.info('💥 Process terminated!');
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.APP_PORT || 4000, () => {
    console.info(chalk.blue(`Server & Socket listening on port ${process.env.APP_PORT}!`));
  });
}

module.exports = io;
