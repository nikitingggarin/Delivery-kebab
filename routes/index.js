const router = require('express').Router();

router.get('/', (req, res) => {
  res.redirect('/auth/register');
});

module.exports = router;
