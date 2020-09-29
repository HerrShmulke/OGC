/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cluster = require('cluster');
const CPUs = require('os').cpus().length;

require('dotenv').config();

const serverPort = process.env.NODE_ENV === 'production' ? 80 : 3000;

if (cluster.isMaster) {
  for (let i = 0; i < CPUs; ++i) cluster.fork();

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died.');
  });

  console.log(`Server start on port: ${serverPort}`);
} else {
  const app = express();

  const pageNotFound = require('./src/controllers/404');
  const api = require('./src/controllers/api');

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/static', express.static('./src/public'));

  app.use('/api', api);
  app.use(pageNotFound);

  app.listen(serverPort);
}
