const router = require('express').Router();
const { Orders, User } = require('../db/models')

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

  const allOrders = await Orders.findAll({ where: { customer_id: null } });


  res.render('index', { allOrders });
});

router.patch('/', async (req, res) => {
  try {
    console.log(req.session.user.id)
    const updatedOrder = await Orders.update({ customer_id: Number(req.session.user.id) }, { where: { id: req.body.orderId } })
    console.log(updatedOrder)
    return res.sendStatus(200).end()
  } catch (err) {
    console.log(err)
    return res.sendStatus(500).end()
  }
})

router.put('/', async (req, res) => {
  try {
    console.log(req.session.user.id)
    const updatedOrder = await Orders.update({ take_order: true }, { where: { id: req.body.orderId } })
    console.log(updatedOrder)
    return res.sendStatus(200).end()
  } catch (err) {
    console.log(err)
    return res.sendStatus(500).end()
  }
})

module.exports = router;
