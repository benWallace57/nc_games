const {
  selectReviews,
  updateReview,
  selectReviewsByID,
} = require("../models/reviews.model");

exports.getReviewsByID = async (req, res, next) => {
  const review_id = req.params.review_id;
  try {
    const reviews = await selectReviewsByID(review_id);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const category = req.query.category;
  const page = req.query.p;
  const limit = req.query.limit;

  try {
    const { rows, totalCount } = await selectReviews(
      sortBy,
      order,
      category,
      page,
      limit
    );
    res.status(200).send({ reviews: rows, totalCount: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.patchReviews = async (req, res, next) => {
  const review_id = req.params.review_id;
  const updateObject = req.body;

  try {
    const reviews = await updateReview(review_id, updateObject);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};
