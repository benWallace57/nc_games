const format = require("pg-format");
const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT username FROM users");
  return rows;
};

exports.selectUsersByUsername = async (username) => {
  const { rows } = await db.query(
    "SELECT username,avatar_url,name FROM users WHERE username = $1",
    [username]
  );
  if (rows.length === 0) {
    throw {
      status: 400,
      msg: "Bad Request: Username does not exist",
    };
  }
  return rows;
};
