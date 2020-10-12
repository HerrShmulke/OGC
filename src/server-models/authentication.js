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
 * Проверяет токен и возвращает true, если он подтвержден
 *
 * @param {string} token
 */
async function verificationToken(token, userAgent) {
  try {
    const signedToken = await jwt.verify(token, process.env.SECRET_KEY);

    return signedToken && signedToken.agent === userAgent;
  } catch {
    return false;
  }
}

async function getVerificationToken(token, userAgent) {
  try {
    const signedToken = await jwt.verify(token, process.env.SECRET_KEY);

    if (signedToken && signedToken.agent === userAgent) {
      return signedToken;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Аутентификация пользователя
 *
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
 * Проверяет, валиден ли токен
 *
 * @type {import('express').RequestHandler}
 */
module.exports.verification = async (req, res) => {
  const token = req.cookies.token || '';
  const userAgent = req.header('User-Agent') || req.header('User-agent');

  res.send({ response: { success: verificationToken(token, userAgent) } });
};

/**
 * Проверяет права доступа к странице
 *
 * @param {string | string[]} roleList
 * @return {import('express').RequestHandler};
 */
module.exports.access = (roleList) => {
  /**
   * @type {import('express').RequestHandler}
   */
  return async function(req, res, next) {
    function sendStatus() {
      res.status(404);
      res.send();
    }

    if (!req.cookies.token) {
      sendStatus();
      return;
    }

    const signedToken = await getVerificationToken(
      req.cookies.token,
      req.header('User-Agent') || req.header('User-agent'),
    );

    if (signedToken) {
      const user = (await db.execute('SELECT `role` FROM `users` WHERE `id`=?', signedToken.id))[0];

      if (typeof roleList === 'string' && user.role === roleList) {
        next();
        return;
      } else if (typeof roleList === 'object') {
        for (let i = 0; i < roleList.length; ++i) {
          if (roleList[i] === user.role) {
            next();
            return;
          }
        }

        sendStatus();
        return;
      }

      sendStatus();
      return;
    }

    sendStatus();
    return;
  };
};
