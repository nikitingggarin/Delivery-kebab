const router = require('express').Router();
const nodemailer = require('nodemailer');
const { Orders, User } = require('../db/models');

router.put('/:id/edit', async (req, res) => {
  try {
    await Orders.update({
      title: req.body.title,
      picture: req.body.picture,
      original_price: req.body.original_price,
      discount_price: req.body.discount_price,
    },
    { where: { id: req.body.editIdOrder } });
  } catch (err) {
    console.log(err);
    // res.redirect('/');
    return res.sendStatus(500).end();
  }
  return res.sendStatus(200).end();
});
router.get('/:id/edit', async (req, res) => {
  console.log(req.params);
  const editOrder = await Orders.findAll({ where: { id: req.params.id } });
  const oneEditOrder = editOrder;
  console.log(oneEditOrder);
  res.render('edit', { editOrder });
});

router.get('/', async (req, res) => {
  let isTrueRaw = true;
  if (req.session.customer) {
    res.locals.customer = req.session.customer;
  }

  if (req.session.courier) {
    res.locals.courier = req.session.courier;
  }

  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  if (!req.session.user) {
    res.locals.notuser = !req.session.user;
  }

  if (req.session.allOrders) {
    res.locals.allOrders = req.session.allOrders;
    console.log(res.locals.allOrders);

    if (req.session.allOrders.length === 0) { isTrueRaw = false; }
  } else {
    const allOrders = await Orders.findAll({ where: { customer_id: null } });
    res.locals.allOrders = allOrders;
    if (allOrders.length === 0) { isTrueRaw = false; }
  }

  res.render('index', { isTrueRaw });
});
router.delete('/', async (req, res) => {
  console.log('jhvv', req.body.orderId);
  try {
    await Orders.destroy({ where: { id: req.body.orderId } });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).end();
  }
  return res.sendStatus(200).end();
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

router.get('/marks', async (req, res) => {
  try {
    const allOrders = await Orders.findAll({ where: { customer_id: null } });
    return res.json(allOrders);
  } catch (err) {
    console.log(err);
  }
});

router.post('/order', async (req, res) => {
  try {
    const distances = [];
    const arr = Object.values(await req.body);
    for await (obj of arr) {
      distances.push(Object.values(obj));
    }
    const allOrders = await Orders.findAll({ where: { customer_id: null }, raw: true });
    for await (order of allOrders) {
      for (let i = 0; i < distances.length; i++) {
        if (order.id === distances[i][0]) {
          const thenum = distances[i][1].replace(/\D+/g, '');
          order.distance = Number(thenum);
          order.distanceString = distances[i][1];
        }
      }
    }
    allOrders.sort((a, b) => a.distance - b.distance);

    req.session.allOrders = allOrders;
    console.log(req.body);
    return res.sendStatus(200).end();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
