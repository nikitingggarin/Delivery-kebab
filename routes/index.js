const router = require('express').Router();

router.get('/', (req, res) => {
  // res.redirect('/auth/register');
  res.render('index', { massege: 'hello' });
});

module.exports = router;
