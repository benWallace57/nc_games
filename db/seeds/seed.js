const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(
    ` DROP TABLE IF EXISTS comments; DROP TABLE IF EXISTS reviews; DROP TABLE IF EXISTS users;DROP TABLE IF EXISTS categories;`
  );

  await db.query(
    `CREATE TABLE categories 
      (slug  VARCHAR(255) PRIMARY KEY, 
      description VARCHAR(255) NOT NULL
      )`
  );
  await db.query(
    `CREATE TABLE users
    (username VARCHAR(255) PRIMARY KEY,
    avatar_url VARCHAR(255),
    name VARCHAR(255))`
  );

  await db.query(
    `CREATE TABLE reviews
      (review_id SERIAL PRIMARY KEY,
      game_title VARCHAR(255) NOT NULL,
      game_designer VARCHAR(255) NOT NULL,
      owner VARCHAR(255) NOT NULL REFERENCES users(username),
      review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      review_body TEXT NOT NULL,
      category VARCHAR(255) REFERENCES categories(slug) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      votes INT NOT NULL DEFAULT 0)`
  );

  await db.query(
    `CREATE TABLE comments
    (comment_id SERIAL PRIMARY KEY,
      author VARCHAR(255),
      review_id INT REFERENCES reviews(review_id),
      votes INT DEFAULT 0,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      body TEXT)`
  );

  let queryString = format(
    `INSERT INTO categories (slug,description) VALUES %L RETURNING *;`,
    categoryData.map((category) => [category.slug, category.description])
  );
  await db.query(queryString);

  queryString = format(
    `INSERT INTO users (username,name,avatar_url) VALUES %L RETURNING *;`,
    userData.map((user) => [user.username, user.name, user.avatar_url])
  );
  await db.query(queryString);

  queryString = format(
    `INSERT INTO reviews (game_title,game_designer,owner,review_img_url,review_body,category,created_at,votes) VALUES %L RETURNING *;`,
    reviewData.map((review) => [
      review.title,
      review.designer,
      review.owner,
      review.review_img_url,
      review.review_body,
      review.category,
      review.created_at,
      review.votes,
    ])
  );
  await db.query(queryString);

  queryString = format(
    `INSERT INTO comments (body,votes,author,review_id,created_at) VALUES %L RETURNING *;`,
    commentData.map((comment) => [
      comment.body,
      comment.votes,
      comment.author,
      comment.review_id,
      comment.created_at,
    ])
  );
  await db.query(queryString);
};

module.exports = seed;
