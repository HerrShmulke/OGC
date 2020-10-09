/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const router = require('express').Router();
const authentication = require('../server-models/authentication');

router.post('/login', authentication.login);
router.post('/verification', authentication.verification);

module.exports = router;
