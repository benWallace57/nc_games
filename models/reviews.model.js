const format = require("pg-format");
const db = require("../db/connection");

exports.selectReviews = async (
  sortBy = "created_at",
  order = "desc",
  category = "",
  page = 1,
  limit = 10
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

  if (!validSorts.includes(sortBy) || !validOrders.includes(order))
    throw {
      status: 400,
      msg: "Bad Request: Invalid sorting options",
    };

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
        comments on comments.review_id = reviews.review_id  WHERE category LIKE $1 
    GROUP BY reviews.review_id 
    ORDER BY ${sortBy} ${order}`;

  const queryStringWithPagination = format(
    queryString + ` LIMIT %L OFFSET %L`,
    limit,
    limit * (page - 1)
  );

  if (!category) {
    category = "%%";
  } else category = "%" + category + "%";

  const totalCount = await db.query(queryString, [category]);

  const { rows } = await db.query(queryStringWithPagination, [category]);

  return { rows: rows, totalCount: totalCount.rows.length };
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

exports.insertReview = async (newReview) => {
  const queryString = format(
    `INSERT INTO reviews 
  (game_title, game_designer, owner, review_img_url, review_body, category) VALUES (%L) RETURNING review_id`,
    [
      newReview.title,
      newReview.designer,
      newReview.owner,
      newReview.review_img_url,
      newReview.review_body,
      newReview.category,
    ]
  );

  const newReviewIDResponse = await db.query(queryString);
  const rows = await this.selectReviewsByID(
    newReviewIDResponse.rows[0].review_id
  );
  return rows;
};

exports.deleteReview = async (review_id) => {
  const { rows } = await db.query(
    `DELETE FROM reviews WHERE review_id = $1 RETURNING *`,
    [review_id]
  );

  if (rows.length === 0) {
    throw {
      status: 400,
      msg: "Bad Request: Review ID does not exist",
    };
  }
  return rows;
};
