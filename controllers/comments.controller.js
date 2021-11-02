const {
  selectCommentsByReviewId,
  insertCommentsByReviewId,
  deleteComment,
  updateComments,
} = require("../models/comments.model");

exports.getCommentsByReviewId = async (req, res, next) => {
  const review_id = req.params.review_id;
  const limit = req.query.limit;
  const page = req.query.p;
  try {
    const comments = await selectCommentsByReviewId(review_id, limit, page);
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

exports.patchComment = async (req, res, next) => {
  const updateObj = req.body;
  const comment_id = req.params.comment_id;

  try {
    const comments = await updateComments(updateObj, comment_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
