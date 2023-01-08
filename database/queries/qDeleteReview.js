const pool = require('../index.js');

module.exports = (review_id) => {
  let query = {
    text: `
      DELETE FROM reviews
      WHERE id=$1
    `,
    values: [review_id]
  };

  return pool.connect()
    .then(client => {
      return client.query(query)
        .then((res) => {
          client.release();
          return res.rows;
        })
        .catch((err) => {
          client.release();
          console.error(err.stack);
        })
    })
};