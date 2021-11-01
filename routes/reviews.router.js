const reviewsRouter = require("express").Router();
const {
  getReviewsByID,
  patchReviews,
  getReviews,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/:review_id", getReviewsByID);
reviewsRouter.get("/", getReviews);

reviewsRouter.patch("/:review_id", patchReviews);

module.exports = reviewsRouter;
