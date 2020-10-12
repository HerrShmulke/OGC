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
const deployer = require('./dbDeployer');

require('dotenv').config();

const serverPort = process.env.NODE_ENV === 'production' ? 80 : 3000;

const app = express();

const pageNotFound = require('./src/server-routes/404');
const api = require('./src/server-routes/api');

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('./src/public'));

app.use('/api', api);
app.use(pageNotFound);

if (cluster.isMaster) {
  for (let i = 0; i < CPUs; ++i) cluster.fork();

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died.');

    app.listen(serverPort, () => console.log('Worker ' + worker.process.pid + ' is online.'));
  });

  cluster.workers['1'].send('\0');

  console.log(`Server start on port: ${serverPort}`);
} else {
  app.listen(serverPort);

  process.on('message', (msg) => {
    deployer();
  });
}
