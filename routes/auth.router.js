const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../db/models');

router
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res) => {
    const { login, email, password } = req.body;
    const saltRounds = process.env.SALT_ROUNDS ?? 10;
    // const rawPassword = req.body.password;

    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.log(error);
    }

    if (hashPassword) {
      const user = await db.User.create({ login, email, password: hashPassword });
      // Создать пользователя в БД
      // Создать сессию для пользователя
      req.session.user = { login, email };
    }
    res.redirect('/entries');
    // res.json({ message: 'OK' });
  });
router
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ raw: true, where: { email } });
    console.log(user.id);
    if (user) {
      const isTruePassword = await bcrypt.compare(password, user.password);
      if (isTruePassword) {
        req.session.user = { id: user.id, login: user.login, email: user.email };
        res.redirect('/entries');
      } else {
        res.render('login', { error: 'логин или пароль не совпадает' });
      }
    } else {
      res.render('login', { error: 'логин или пароль не совпадает' });
    }
    //

    // Получить пользователя из БД
    // Сравнить "сырой" пароль, пришедший из формы, с хэшированным паролем пользователя
    // Если сравнение успешно, создать сессию

    // res.json({ message: 'OK' });
    // res.redirect('/entries');
  });

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
