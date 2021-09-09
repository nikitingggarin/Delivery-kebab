require('dotenv').config();
const express = require('express');

const logger = require('morgan');
const path = require('path');
// Импортируем созданный в отдельный файлах рутеры.
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.router');
const courierRouter = require('./routes/courierRouter');

const app = express();
const PORT = 3000;

// Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('view engine', 'hbs');
// Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".
app.set('views', path.join(__dirname, 'views'));

// Подключаем middleware morgan с режимом логирования "dev",
// чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(logger('dev'));
// Подключаем middleware, которое сообщает epxress,
// что в папке "ПапкаПроекта/public" будут находится статические файлы,
// т.е. файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware,
// которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, которое позволяет читать переменные JavaScript,
// сохранённые в формате JSON в body HTTP-запроса.
app.use(express.json());

const sessionConfig = {
  store: new FileStore(),
  name: 'user_sid', // Имя куки для хранения id сессии. По умолчанию - connect.sid
  secret: 'notaverygoodsecrethonestlyspeaking',
  resave: false, // Пересохранять ли куку при каждом запросе
  saveUninitialized: false, // Создавать ли сессию без инициализации ключей в req.session
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // Срок истечения годности куки в миллисекундах
    httpOnly: true, // Серверная установка и удаление куки, по умолчанию true
  },
};
app.use(session(sessionConfig));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/courier', courierRouter);

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
