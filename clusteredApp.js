require('dotenv').config();

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const net = require('net');
const farmhash = require('farmhash');
const chalk = require('chalk');
const server = require('./server');

if (process.env.NODE_ENV === 'development') {
  server.listen(process.env.APP_PORT || 4000, () => {
    console.info(chalk.blue(`Server & Socket listening on port ${process.env.APP_PORT || 4000}!`));
  });
} else if (cluster.isMaster) {
  console.info(`Master ${process.pid} is running`);

  const workers = [];

  const spawn = (i) => {
    workers[i] = cluster.fork();

    workers[i].on('exit', (worker, code, signal) => {
      if (worker && worker.process && worker.process.pid) {
        console.warn(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
      }
      console.info('Starting a new worker');
      spawn(i);
    });
  };

  for (let i = 0; i < numCPUs; i += 1) {
    spawn(i);
  }
  const workerIndex = (ip, len) => (ip ? farmhash.fingerprint32(ip) % len : farmhash.fingerprint32('demo') % len);

  net.createServer({ pauseOnConnect: true }, (connection) => {
    const worker = workers[workerIndex(connection.remoteAddress, numCPUs)];
    worker.send('sticky-session:connection', connection);
  }).listen(process.env.APP_PORT || 4000);
} else {
  console.info(`Worker ${process.pid} started`);

  server.listen(0, () => {
    console.info(chalk.blue(`Server & Socket listening on port ${process.env.APP_PORT}!`));
  });
}
