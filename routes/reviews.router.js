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
reviewsRouter.post("/", postReview);

reviewsRouter.get("/:review_id", getReviewsByID);
reviewsRouter.patch("/:review_id", patchReviews);
reviewsRouter.delete("/:review_id", removeReview);

reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postCommentByReviewId);

module.exports = reviewsRouter;
