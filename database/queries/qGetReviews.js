const pool = require('../index.js');

module.exports = ({productId, page, count, sort}) => {
  let offset = count * page - count;

  if (sort === 'newest') sort = 'date desc';
  if (sort === 'helpful') sort = 'helpfulness desc';
  if (sort === 'relevant') sort = 'helpfulness desc, date desc';

  count = count.toString();
  offset = offset.toString();

  const query = {
    text: `
    SELECT id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness,
    ( SELECT coalesce(json_agg(to_json(photo_rows)), '[]')
        FROM (
            SELECT rp.id, rp.url
            FROM reviews r
            inner join reviews_photos rp
            ON r.id = rp.review_id
            WHERE rp.review_id = reviews.id
        ) photo_rows
    ) as photos
    FROM reviews
    WHERE product_id=$1 and reported=false
    ORDER BY ${sort}
    LIMIT $2
    OFFSET $3
    ;`,
    values: [productId, count, offset]
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