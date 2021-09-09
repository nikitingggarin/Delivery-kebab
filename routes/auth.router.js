const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../db/models');

/// ///////////регистрация//////////////////
router
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })

  .post(async (req, res) => {
    const {
      login, email, password, phone, type_user,
    } = req.body;
    if (!login || !email || !password || !phone || !type_user) {
      const error = { message: 'Поля не могут быть пустыми' };
      return res.status(400).json({ error });
    }
    let emailError;
    try {
      emailError = await db.User.findOne({
        raw: true,
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
    if (emailError) {
      const error = { message: 'Пользователь с таким email уже зарегистрирован' };
      return res.status(400).json({ error });
    }
    let loginError;
    try {
      loginError = await db.User.findOne({
        raw: true,
        where: {
          login,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
    if (loginError) {
      const error = { message: 'Пользователь с таким login уже зарегистрирован' };
      return res.status(400).json({ error });
    }

    const saltRounds = process.env.SALT_ROUNDS ?? 10;
    // const rawPassword = req.body.password;

    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.log(error);
    }

    if (hashPassword) {
      const user = await db.User.create({
        login, email, password: hashPassword, type_user, phone,
      });
      req.session.user = { id: user.id, login: user.login };

      if (user.type_user === 'courier') {
        req.session.courier = { id: user.id, login: user.login };
      } else {
        req.session.customer = { id: user.id, login: user.login };
      }
    }

    // return res.redirect('/');
    return res.status(201).json({ link: '/' });
    // res.json({ message: 'OK' });
  });

/// ////////////////////авторизация/////////////////////////
router
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })

  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ raw: true, where: { email } });

    if (user) {
      const isTruePassword = await bcrypt.compare(password, user.password);
      if (isTruePassword) {
        req.session.user = { id: user.id, login: user.login };

        if (user.type_user === 'courier') {
          req.session.courier = { id: user.id, login: user.login };
        } else {
          req.session.customer = { id: user.id, login: user.login };
        }
        // res.redirect('/');
        return res.status(201).json({ link: '/' });
      }
      const error = { message: 'Адрес электронной почты или пароль не совпадает' };
      return res.status(400).json({ error });

      // res.render('login', { error: 'логин или пароль не совпадает' });
    }
    let emailError;
    try {
      emailError = await db.User.findOne({
        raw: true,
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }

    if (!emailError) {
      const error = { message: 'Адрес электронной почты или пароль не совпадает' };
      return res.status(400).json({ error });
    }
  });

/// ////////////////выход///////////////////////
router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.render('error', { message: 'Ошибка при выходе из системы' });
      return;
    }
    res
      .clearCookie('user_sid')
      .redirect('/auth/login');
  });
});
module.exports = router;
