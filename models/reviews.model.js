const format = require("pg-format");
const db = require("../db/connection");
const reviewsRouter = require("../routes/reviews.router");

exports.selectReviews = async () => {
  const queryString = format(
    `SELECT 
        owner, 
        game_title AS title, 
        reviews.review_id, 
        review_body,
        game_designer AS designer, 
        review_img_url, category,
        reviews.created_at, 
        reviews.votes,
        CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM 
        reviews 
    LEFT JOIN 
        comments on comments.review_id = reviews.review_id
    GROUP BY 
        reviews.review_id`
  );

  const { rows } = await db.query(queryString);

  return rows;
};

exports.selectReviewsByID = async (review_id) => {
  const queryString = format(
    `SELECT 
        owner, 
        game_title AS title, 
        reviews.review_id, 
        review_body,
        game_designer AS designer, 
        review_img_url, category,
        reviews.created_at, 
        reviews.votes,
        CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM 
        reviews 
    LEFT JOIN 
        comments on comments.review_id = reviews.review_id
    WHERE 
        reviews.review_id = %L 
    GROUP BY 
        reviews.review_id`,
    review_id
  );
  const { rows } = await db.query(queryString);

  if (rows.length === 0) {
    throw {
      status: 400,
      msg: "Bad Request: Review ID does not exist",
    };
  }
  return rows;
};

exports.updateReview = async (review_id, updateObject) => {
  const incAmount = updateObject.inc_votes;

  const queryString = format(
    `UPDATE reviews SET votes = (votes + %L) WHERE review_id = %L RETURNING *`,
    incAmount,
    review_id
  );
  console.log(queryString, "QUERY STRING");

  const { rows } = await db.query(queryString);
  if (rows.length === 0) {
    throw {
      status: 400,
      msg: "Bad Request: Review ID does not exist",
    };
  }
  return rows;
};
