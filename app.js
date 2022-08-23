const express = require('express');

const { PORT = 3001 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send({foo: 'Hello world!'})
})

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});