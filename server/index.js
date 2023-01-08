const express = require('express');
const morgan = require('morgan');
const app = express();
const router = require('./router.js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(morgan('development'));
app.use(express.json());


const host = process.env.EXPRESS_HOST || 'localhost';
const port = process.env.EXPRESS_PORT || '3000';

app.use('/reviews', router);

app.get(`/${process.env.LOADER_IO}/`, (req, res) => {
  res.send(`${process.env.LOADER_IO}`)
});

app.get('/', (req, res) => {
  res.send('Hello SDC!');
});

app.listen(port, () => {
  console.log('\x1b[33m%s\x1b[0m', `Environment: ${process.env.NODE_ENV}`);
  console.log('\x1b[36m%s\x1b[0m', `Listening at http://${host}:${port}`);
});

module.exports = app;