const format = require("pg-format");
const db = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories;`);

  return rows;
};
