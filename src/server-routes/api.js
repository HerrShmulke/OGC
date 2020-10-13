/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const router = require('express').Router();
const authentication = require('../server-models/authentication');
const fileManager = require('../server-models/file-manager');
const laboratory = require('../server-models/laboratory');
const db = require('../server-modules/db');

router.post('/login', authentication.login);
router.post('/verification', authentication.verification);
router.post('/labs/upload', authentication.access('student'), fileManager.uploadLabWork);
router.post('/labs/list', authentication.access('student'), laboratory.topicList);
router.get('/test', async (req, res) => {
  console.log(
    await db.query(
      `SELECT laboratory_topic.id, laboratory_works.upload_date FROM laboratory_topic INNER JOIN laboratory_works ON laboratory_works.topic_id=laboratory_topic.id AND laboratory_works.owner_id=1`,
    ),
  );
});

module.exports = router;
