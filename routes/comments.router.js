const commentsRouter = require("express").Router();
const {
  removeComment,
  patchComment,
} = require("../controllers/comments.controller");
commentsRouter.delete("/:comment_id", removeComment);
commentsRouter.patch("/:comment_id", patchComment);

module.exports = commentsRouter;
