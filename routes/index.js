const router = require('express').Router();
const nodemailer = require('nodemailer');
const { Orders, User } = require('../db/models');

router.get('/', async (req, res) => {
  if (req.session.customer) {
    res.locals.customer = req.session.customer;
  }

  if (req.session.courier) {
    res.locals.courier = req.session.courier;
  }

  if (req.session.user) {
    res.locals.user = req.session.user;
  }

  const allOrders = await Orders.findAll({ where: { customer_id: null } });
  let isTrueRaw = true;
  if (allOrders.length === 0) { isTrueRaw = false; }
  res.render('index', { allOrders, isTrueRaw });
});

router.patch('/', async (req, res) => {
  try {
    console.log(req.session.user.id);
    const customer = await User.findOne({ where: { id: req.session.user.id } });
    const idCourierOrders = await Orders.findOne({ where: { id: req.body.orderId } });
    const courier = await User.findOne({ where: { id: idCourierOrders.courier_id } });
    const courierEmail = courier.email;
    const updatedOrder = await Orders.update({ customer_id: Number(req.session.user.id) },
      { where: { id: req.body.orderId } });
    const { email } = customer;
    // настройка клиента почты
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // формируем сообщение для customer
    const mailСustomer = {
      from: 'elbrusmailgoogl@gmail.com',
      to: email,
      subject: 'Доставка кебаб',
      text: 'у вас доставочка',
    };
    // формируем сообщение для courier
    const mailСourier = {
      from: 'elbrusmailgoogl@gmail.com',
      to: courierEmail,
      subject: 'пора на работу',
      text: 'У вас есть заказ',
    };
    // отправляем сообщение
    await transporter.sendMail(mailСustomer);
    await transporter.sendMail(mailСourier);
    //
    return res.sendStatus(200).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).end();
  }
});

router.put('/', async (req, res) => {
  try {
    console.log(req.session.user.id);
    const updatedOrder = await Orders.update({ take_order: true }, { where: { id: req.body.orderId } });
    console.log(updatedOrder);
    return res.sendStatus(200).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).end();
  }
});

module.exports = router;
