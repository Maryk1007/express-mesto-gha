require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const router = require('./routes/routes');

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// обработка кросс-доменных запросов
app.use(cors);

// логгер запросов
app.use(requestLogger);

// краш-тест сервера

// все роуты
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обрабтчик ошибок для celebrate
app.use(errors());

// цетрализованная обработка ошибок
app.use(error);

// подключение к mongo и серверу
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Connect ${PORT}`);
  });
}

main();
