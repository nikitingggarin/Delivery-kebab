const router = require('express').Router();
const { Op } = require('sequelize');
const { Orders, User } = require('../db/models');

router.route('/')
  .get(async (req, res) => {
    if (req.session.customer) {
      res.locals.customer = req.session.customer;
    }

    if (req.session.courier) {
      res.locals.courier = req.session.courier;
    }

    if (req.session.user) {
      res.locals.user = req.session.user;
    }
    const allOrders = await Orders.findAll({
      include: [{
        model: User,
        as: 'customer',
      }],
      where: {
        courier_id: res.locals.user.id,
        customer_id: {
          [Op.ne]: null,
        },
        take_order: null,
      },
    });
    console.log(res.locals.user.id);
    let isTrueRaw = true;
    if (allOrders.length === 0) { isTrueRaw = false; }
    // console.log(allOrders[0].customer);
    res.render('courierAccount', { allOrders, isTrueRaw });
  })

  .post(async (req, res) => {
    try {
      const { title, picture, original_price, discount_price, courier_location } = req.body;
      const courier_id = req.session.courier.id;
      const newOrder = await Orders.create({ title, picture, original_price, discount_price, courier_location, courier_id });
      return res.sendStatus(200).end();
    } catch (err) {
      console.log(err);
      return res.sendStatus(500).end();
    }

  });

module.exports = router;
