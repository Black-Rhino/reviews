const qGetReviews = require('../database/queries/qGetReviews.js');
const qAddReview = require('../database/queries/qAddReview.js');
const qDeleteReview = require('../database/queries/qDeleteReview.js');
const qMarkHelpful = require('../database/queries/qMarkHelpful.js');
const qReportReview = require('../database/queries/qReportReview.js');
const qGetMeta = require('../database/queries/qGetMeta.js');

const getReviews = (req, res) => {
  const productId = req.params.product_id;
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  const sort = req.query.sort || 'newest';

  qGetReviews({ productId, page, count, sort })
    .then(data => {
      res.status(200).send({ product: productId, page, count, results: data });
    })
    .catch(err => {
      res.status(500).send(`Error getting reviews, ${err}`);
    })
};

const addReview = (req, res) => {
  const review = {product_id: req.params.product_id, ...req.body};
  qAddReview(review)
    .then((data) => {
      let review_id = data[0].id;
      res.status(201).send({ review_id });
      console.log(`a new review with id ${review_id} has been added to db`);
    })
    .catch((err) => {
      res.status(501).send(`Error adding data to db, ${err}`);
    })
};

const deleteReview = (req, res) => {
  const reviewId = req.params.review_id;
  qDeleteReview(reviewId)
    .then((data) => {
      res.sendStatus(204);
      console.log(`a review with id ${reviewId} has been deleted from db`);
    })
    .catch((err) => {
      res.status(501).send(`Error deleting data from db, ${err}`);
    })
};

const markHelpful = (req, res) => {
  const reviewId = req.params.review_id;
  qMarkHelpful(reviewId)
    .then((data) => {
      res.sendStatus(204);
      console.log(`a review with id ${reviewId} has been marked helpful`)
    })
    .catch((err) => {
      res.status(501).send(`Error updating data from db, ${err}`)
    })
};

const reportReview = (req, res) => {
  const reviewId = req.params.review_id;
  qReportReview(reviewId)
    .then((data) => {
      res.sendStatus(204);
      console.log(`a review with id ${reviewId} has been marked reported`);
    })
    .catch((err) => {
      res.status(501).send(`Error updating data from db, ${err}`)
    })
};

const getMeta = (req, res) => {
  const productId = req.params.product_id;
  qGetMeta(productId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(`Error getting meta data, ${err}`);
    })
};

module.exports = { getReviews, addReview, deleteReview, markHelpful, reportReview, getMeta };

