const router = require('express').Router();
const { Orders } = require('../db/models')

router.get('/', async (req, res) => {

  if (req.session.customer) {
    res.locals.customer = req.session.customer;
  };

  if (req.session.courier) {
    res.locals.courier = req.session.courier;
  };

  if (req.session.user) {
    res.locals.user = req.session.user;
  };

  const allOrders = await Orders.findAll();
  console.log(allOrders)

  res.render('index', { allOrders });
});

module.exports = router;
