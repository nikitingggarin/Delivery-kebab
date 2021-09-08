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
    res.redirect('/');
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
        res.redirect('/');
      } else {
        res.render('login', { error: 'логин или пароль не совпадает' });
      }
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
