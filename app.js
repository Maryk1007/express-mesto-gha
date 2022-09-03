const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/usersController');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// роутеры пользователей и карточек
app.use('/users', auth, require('./routes/userRoutes'));
app.use('/cards', auth, require('./routes/cardRoutes'));

// обработка несуществующих путей
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

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
