const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/usersController');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// роутеры пользователей и карточек
app.use('/users', auth, require('./routes/userRoutes'));
app.use('/cards', auth, require('./routes/cardRoutes'));

// обработка несуществующих роутов
app.use((req, res, next) => {
  next(res.status(NotFoundError).send({ message: 'Страница не найдена' }));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
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
