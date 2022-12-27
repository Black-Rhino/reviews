const express = require('express');
const app = express();


if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config();
}


app.use(express.json());

const host = process.env.EXPRESS_HOST || 'localhost';
const port = process.env.EXPRESS_PORT || 3000;
const router = require('./router')

app.listen(port, () => console.log(`Listening at http://${host}:${port}`));

module.exports = app;