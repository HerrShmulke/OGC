/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const errors = require('../server-modules/error-codes');
const db = require('../server-modules/db');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const laboratory = require('../server-models/laboratory');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './storage');
  },

  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

/** @type {import('express').RequestHandler} */
const fileFilter = async (req, file, cb) => {
  const userId = jwt.decode(req.cookies.token).id;
  const topicId = parseInt(req.body.topicId);

  if (file.mimetype === 'application/pdf' && (await laboratory.uploadCheck(userId, topicId))) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 3e6,
    files: 1,
  },
  fileFilter,
});

/**
 * Загружает лабораторную работу на сервер
 * @type {import('express').RequestHandler}
 */
module.exports.uploadLabWork = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (!req.file) {
      res.send({ error: errors.invalidParams });
      return;
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.send({ error: errors.limitFileSize });
      }
    } else {
      try {
        const time = new Date();
        const dbTime = `${time.getUTCFullYear()}-${time.getUTCMonth() + 1}-${time.getUTCDate()}`;

        const userId = jwt.decode(req.cookies.token);
        const sql =
          'INSERT INTO `laboratory_works` (`file_name`, `owner_id`, `topic_id`, `upload_date`) VALUES (?, ?, ?, ?)';

        await db.execute(sql, [req.file.filename, userId.id, req.body.topicId, dbTime]);

        res.send({ response: { success: true } });
      } catch (err) {
        res.send({ error: errors.unkownError });
      }
    }
  });
};
