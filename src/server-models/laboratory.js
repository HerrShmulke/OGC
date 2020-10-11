/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const db = require('../server-modules/db');

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

module.exports = { topicCheck, uploadCheck };
