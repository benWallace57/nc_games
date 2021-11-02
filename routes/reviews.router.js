const reviewsRouter = require("express").Router();
const {
  getReviewsByID,
  patchReviews,
  getReviews,
  postReview,
  removeReview,
} = require("../controllers/reviews.controller");

const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("../controllers/comments.controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewsByID);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);

reviewsRouter.patch("/:review_id", patchReviews);

reviewsRouter.post("/", postReview);
reviewsRouter.post("/:review_id/comments", postCommentByReviewId);
reviewsRouter.delete("/:review_id", removeReview);

module.exports = reviewsRouter;
