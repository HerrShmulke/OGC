/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const db = require('../server-modules/db');
const auth = require('../server-models/authentication');

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} laboratoryTopic~asd
 * @property {number} id
 * @property {string} name
 * @property {Date} begin_date
 * @property {Date} end_date
 */

/**
 * Функция возвращает актуальные лабораторные работы
 */
async function topicCheck() {
  /** @type {laboratoryTopic[]} */
  const topics = await db.query('SELECT * FROM `laboratory_topic`');

  const time = new Date();
  const currentStringUtcTime = `${time.getUTCFullYear()}-${time.getUTCMonth() +
    1}-${time.getUTCDate()} ${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}`;

  const currentKemerovoTime = new Date(currentStringUtcTime);
  currentKemerovoTime.setHours(currentKemerovoTime.getHours() + 7);

  let actualTopics = [];

  for (let i = 0; i < topics.length; ++i) {
    const beginDate = topics[i].begin_date;
    beginDate.setUTCHours(0);
    beginDate.setUTCMinutes(0);
    beginDate.setUTCSeconds(0);
    beginDate.setUTCDate(beginDate.getUTCDate() + 1);

    const endDate = topics[i].end_date;
    endDate.setUTCHours(16);
    endDate.setUTCMinutes(59);
    endDate.setUTCSeconds(59);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    if (currentKemerovoTime > beginDate && currentKemerovoTime < endDate) actualTopics.push(topics[i]);
  }

  return actualTopics;
}

/**
 * Функция проверяет, может ли пользователь загрузить работу на указанную тему
 */
async function uploadCheck(userId, topicId) {
  const topics = await topicCheck();

  for (let i = 0; i < topics.length; ++i) {
    if (topics[i].id === topicId) {
      const sql = 'SELECT `id` FROM `laboratory_works` WHERE `owner_id`=? AND `topic_id`=?';
      const result = await db.execute(sql, [userId, topicId]);

      if (result && result.length == 1) return false;
      else return true;
    }
  }

  return false;
}

/**
 * Выводит список лабораторных работ
 * @type {import('express').RequestHandler}
 */
async function topicList(req, res) {
  const sql =
    'SELECT laboratory_topic.id FROM laboratory_topic INNER JOIN laboratory_works ON laboratory_works.topic_id=laboratory_topic.id AND laboratory_works.owner_id=?';
  // Список сданных работ студентом
  const waitingPerformedWorks = db.execute(sql, [req.access.id]);
  const waitingLaboratoryTopics = db.query('SELECT * FROM `laboratory_topic` WHERE 1');

  const waitingResult = await Promise.all([waitingLaboratoryTopics, waitingPerformedWorks]);

  const topics = waitingResult[0].map((e) => {
    e.workDone = waitingResult[1].find((item) => e.id === item.id) !== undefined;
    return e;
  });

  res.send({ response: topics });
}

module.exports = { topicCheck, uploadCheck, topicList };
