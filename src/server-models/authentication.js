/**
 * @author Shmulter
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const errors = require('../server-modules/error-codes');
const db = require('../server-modules/db');

/**
 * Возвращает результат прохождения каптчи
 * @param {string} reToken Recaptcha token
 */
async function recaptchaValidate(reToken) {
  const googleUrl = 'https://www.google.com/recaptcha/api/siteverify';

  const recaptcha = (
    await axios({
      method: 'POST',
      url: googleUrl,
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: reToken,
      },
    })
  ).data;

  return recaptcha.success;
}

/**
 * @type {import('express').RequestHandler}
 */
module.exports.login = async (req, res) => {
  const mail = req.body.name;
  const pass = req.body.pass;
  const reToken = req.body.reToken;
  const remember = req.body.remember;

  try {
    if (mail && pass && reToken) {
      if (await recaptchaValidate(reToken)) {
        let dbUser = await db.execute('SELECT `id`, `password` FROM `users` WHERE `login`=?', [mail]);

        if (dbUser && dbUser.length > 0 && (await argon2.verify(dbUser[0].password, pass))) {
          const payload = { id: dbUser[0].id, mail, agent: req.header('User-Agent') || req.header('User-agent') };

          const jwtOptions = {
            expiresIn: remember ? '30d' : '1h',
            algorithm: 'HS256',
          };

          const token = jwt.sign(payload, process.env.SECRET_KEY, jwtOptions);

          res.cookie('token', token, { domain: process.env.HOST, maxAge: remember ? 0x9a7ec800 : 0x36ee80 });
          res.send({ response: { allowed: true } });
        } else {
          res.send({ error: errors.invalidLoginOrPassword });
        }
      } else {
        res.send({ error: errors.invalidRecaptcha });
      }
    } else {
      res.send({ error: errors.invalidParams });
    }
  } catch (_err) {
    res.send({ error: errors.unkownError });
  }
};

/**
 * @type {import('express').RequestHandler}
 */
module.exports.verification = async (req, res) => {
  try {
    const token = await jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    const userAgent = req.header('User-Agent') || req.header('User-agent');

    if (token && token.agent === userAgent) {
      res.send({ response: { success: true } });
    } else {
      res.send({ response: { success: false } });
    }
  } catch {
    res.send({ response: { success: false } });
  }
};
