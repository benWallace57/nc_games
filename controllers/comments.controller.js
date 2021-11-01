const {
  selectCommentsByReviewId,
  insertCommentsByReviewId,
  deleteComment,
} = require("../models/comments.model");

exports.getCommentsByReviewId = async (req, res, next) => {
  const review_id = req.params.review_id;
  try {
    const comments = await selectCommentsByReviewId(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByReviewId = async (req, res, next) => {
  const review_id = req.params.review_id;
  const newComment = req.body;
  try {
    const comments = await insertCommentsByReviewId(review_id, newComment);
    res.status(201).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.removeComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  try {
    await deleteComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
