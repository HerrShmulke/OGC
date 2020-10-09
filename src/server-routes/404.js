/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const express = require('express');

const router = express.Router();

router.use((req, res) => {
  res.status(404);
  res.send('Not found');
});

module.exports = router;
