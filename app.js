/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

const pageNotFound = require('./src/controllers/404');
const api = require('./src/controllers/api');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('./src/public'));

app.use('/api', api);
app.use(pageNotFound);

app.listen(3000);
