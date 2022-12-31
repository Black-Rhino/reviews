const pool = require('../index.js');

module.exports = (review) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = review;
  let query = {
    text: `
    with new_review as (
      INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      values($1, $2, extract(epoch from now())*1000, $3, $4, $5, $6, $7)
      RETURNING id
    )
    SELECT new_review.id FROM new_review;
    `,
    values: [product_id, rating, summary, body, recommend, name, email]
  }

  return pool.connect()
    .then(client => {
      return client.query(query)
        .then(async (res) => {
          await photos.forEach(photo => {
            query = {
              text: `insert into reviews_photos(review_id, url) values($1, $2)`,
              values: [res.rows[0].id, photo]
            };
            client.query(query);
          });
          client.release();
          return res.rows;
        })
        .catch((err) => {
          client.release();
          console.error(err.stack);
        })
    })
};