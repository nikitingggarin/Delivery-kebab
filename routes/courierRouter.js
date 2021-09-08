const router = require('express').Router();
const { Orders, User } = require('../db/models');
const { Op } = require("sequelize");

router.route('/')
  .get(async (req, res) => {
    if (req.session.customer) {
      res.locals.customer = req.session.customer;
    };

    if (req.session.courier) {
      res.locals.courier = req.session.courier;
    };

    if (req.session.user) {
      res.locals.user = req.session.user;
    };
    const allOrders = await Orders.findAll({
      include: [{ model: User }],
      where: {
        customer_id: {
          [Op.ne]: null
        },
        take_order: null
      }
    });


    res.render('courierAccount', { allOrders });
  })

  .post(async (req, res) => {
    const courier_id = req.session.user.id;
    const { title, picture, original_price, discount_price } = req.body;
    const newOrder = await Orders.create({ courier_id, title, picture, original_price, discount_price })
    console.log(newOrder)
    res.redirect('/');
  })




module.exports = router;

