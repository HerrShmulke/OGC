/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mysql = require('mysql2');
const pool = mysql.createPool({
  connectionLimit: 100,
  waitForConnections: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_BASE,
});

/**
 * Отправляет запрос к базе данных
 * @param {String} sql
 * @returns {Promise<import('mysql2').RowDataPacket[]>}
 */
function query(sql) {
  return new Promise((res, rej) => {
    pool.query(sql, (err, result) => {
      if (err) rej(err);
      else res(result);
    });
  });
}

/**
 * Отправляет запрос к базе данных с подстановкой
 * @param {String} sql
 * @returns {Promise<import('mysql2').RowDataPacket[]>}
 */
function execute(sql, params = []) {
  return new Promise((res, rej) => {
    pool.query(sql, params, (err, result) => {
      if (err) rej(err);
      else res(result);
    });
  });
}

module.exports.query = query;
module.exports.execute = execute;
