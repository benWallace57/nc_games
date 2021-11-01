const format = require("pg-format");
const db = require("../db/connection");
const { selectReviewsByID } = require("./reviews.model");

exports.selectCommentsByReviewId = async (review_id) => {
  await selectReviewsByID(review_id);

  const queryString = format(
    `SELECT comment_id, votes, created_at, author, body from comments WHERE review_id = %L`,
    review_id
  );
  const { rows } = await db.query(queryString);

  if (rows.length === 0) {
    throw {
      status: 200,
      msg: "No Results",
    };
  }
  return rows;
};

exports.insertCommentsByReviewId = async (review_id, newComment) => {
  await selectReviewsByID(review_id);
  const queryString = format(
    "INSERT INTO comments (author,body,review_id) VALUES ( %L ) RETURNING comment_id, author as username, body;",
    [newComment.username, newComment.body, review_id]
  );

  const { rows } = await db.query(queryString);
  return rows;
};

exports.deleteComment = async (comment_id) => {
  const { rows } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
    [comment_id]
  );
  if (rows.length === 0)
    throw {
      status: 400,
      msg: "Bad Request: Invalid Comment ID",
    };
  return rows;
};
