const express = require('express');

const { PORT = 3001 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send({ foo: 'Hello world!' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listen on ${PORT}`);
});
