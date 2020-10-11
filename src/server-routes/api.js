/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const router = require('express').Router();
const authentication = require('../server-models/authentication');
const fileManager = require('../server-models/file-manager');
const laboratory = require('../server-models/laboratory');

router.post('/login', authentication.login);
router.post('/verification', authentication.verification);
router.post('/labs/upload', fileManager.uploadLabWork);
router.get('/labs/current', async (req, res) => {
  res.send(await laboratory.uploadCheck(1, 1));
});

module.exports = router;
