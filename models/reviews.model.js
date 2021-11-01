const format = require("pg-format");
const db = require("../db/connection");

exports.selectReviews = async (
  sortBy = "created_at",
  order = "desc",
  category = ""
) => {
  const validSorts = [
    "owner",
    "title",
    "review_id",
    "review_body",
    "designer",
    "review_img_url",
    "created_at",
    "votes",
  ];
  const validOrders = ["asc", "desc", "ASC", "DESC"];
  let queryString = `SELECT 
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
        comments on comments.review_id = reviews.review_id  WHERE category LIKE $1 `;

  if (!category) {
    category = "%%";
  } else category = "%" + category + "%";

  if (!validSorts.includes(sortBy) || !validOrders.includes(order))
    throw {
      status: 400,
      msg: "Bad Request: Invalid sorting options",
    };

  queryString += ` GROUP BY reviews.review_id ORDER BY ${sortBy} ${order};`;

  const { rows } = await db.query(queryString, [category]);

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
  if (!incAmount) {
    throw {
      status: 400,
      msg: "Bad Request: invalid input",
    };
  }

  const queryString = format(
    `UPDATE reviews SET votes = (votes + %L) WHERE review_id = %L RETURNING *`,
    incAmount,
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
