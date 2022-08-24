const mongoose = require('mongoose');

const express = require('express');

const { PORT = 3001 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send({ foo: 'Hello world!' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  // eslint-disable-next-line no-console
  console.log(mongoose.connection.readyState);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Connect ${PORT}`);
  });
}

main();
