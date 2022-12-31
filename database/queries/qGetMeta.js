const pool = require('../index.js');

module.exports = async (product_id) => {

  let queryR = {
    text: `
      SELECT id, rating, recommend
      FROM reviews
      WHERE product_id=$1
    `,
    values: [product_id]
  };

  let queryC = {
    text: `
      SELECT id, name
      FROM characteristics
      WHERE product_id=$1
    `,
    values: [product_id]
  };

  const client = await pool.connect();

  const recommended = {0: 0, 1: 0};
  const ratings = {};

  let rev = await client.query(queryR);
  rev = rev.rows;

  for (let  i = 0; i < rev.length; i++) {
    let review = rev[i];
    ratings[review.rating] = ratings[review.rating] + 1 || 1;
    review.recommend ? recommended['1'] += 1 : recommended['0'] += 1;
  }

  const characteristics = {};
  let char = await client.query(queryC);
  char = char.rows;

  for (let i = 0 ; i < char.length; i++) {
    let charId = char[i].id;
    let charName = char[i].name;
    const queryCR = {
      text: `
        SELECT AVG(value)
        FROM characteristics_reviews
        WHERE characteristic_id=$1
      `,
      values: [charId]
    };
    let avg = await client.query(queryCR);
    if (avg.rows[0].avg !== null) {
      avg = avg.rows[0].avg.substring(0, 6);
      characteristics[charName] = { id: charId, value: avg };
    } else {
      characteristics[charName] = { id: charId, value: null};
    }
  }

  client.release();
  return { product_id, ratings, recommended, characteristics };
};