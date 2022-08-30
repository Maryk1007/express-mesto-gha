const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/usersController');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
// const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// роутеры пользователей и карточек
app.use('/users', require('./routes/userRoutes'));
app.use('/cards', require('./routes/cardRoutes'));

// обработка несуществующих роутов
app.use((req, res, next) => {
  next(res.status(NotFoundError).send({ message: 'Страница не найдена' }));
});

app.use(errors());

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
