const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 12,
});

pool.connect((err, client, done) => {
  if (err) {
    console.log(`Error connecting to db, ${err}`);
    process.exit(-1)
  } else {
    console.log('\x1b[36m%s\x1b[0m', `Connected to ${client.user}@${client.host} using database ${client.database} on port ${client.port} 😄`);
  }
  done();
})

module.exports = pool;