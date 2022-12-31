const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview, markHelpful, reportReview, getMeta } = require('./controllers.js');

router.get('/:product_id/list', getReviews);
router.post('/:product_id', addReview);
router.delete('/:review_id', deleteReview);
router.put('/:review_id/helpful', markHelpful);
router.put('/:review_id/report', reportReview);
router.get('/:product_id/meta', getMeta);

module.exports = router;