const router = require('express').Router();
const { Orders } = require('../db/models')

router.route('/')
  .get((req, res) => {
    if (req.session.customer) {
      res.locals.customer = req.session.customer;
    };

    if (req.session.courier) {
      res.locals.courier = req.session.courier;
    };

    if (req.session.user) {
      res.locals.user = req.session.user;
    };
    res.render('courierAccount');
  })

  .post(async (req, res) => {
    const courier_id = req.session.user.id;
    const { title, picture, original_price, discount_price } = req.body;
    const newOrder = await Orders.create({ courier_id, title, picture, original_price, discount_price })
    console.log(newOrder)
    res.redirect('/');
  })




module.exports = router;

