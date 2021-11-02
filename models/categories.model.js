const format = require("pg-format");
const db = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories;`);

  return rows;
};

exports.insertCategory = async (newCategory) => {
  const queryString = format(
    `INSERT INTO categories (slug,description) VALUES (%L) RETURNING *`,
    [newCategory.slug, newCategory.description]
  );

  const { rows } = await db.query(queryString);

  return rows;
};
