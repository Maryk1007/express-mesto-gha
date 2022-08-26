const mongoose = require('mongoose');
const express = require('express');

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '630722042be5fa6d495e5442',
  };

  next();
});

// роутеры пользователей и карточек
app.use('/users', require('./routes/userRoutes'));
app.use('/cards', require('./routes/cardRoutes'));

// обработка несуществующих роутов
app.use((req, res, next) => {
  next(res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' }));
});

// подключение к mongo и серверу
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Connect ${PORT}`);
  });
}

main();
