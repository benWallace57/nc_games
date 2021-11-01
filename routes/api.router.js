const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");
const commentsRouter = require("./comments.router");
const fs = require("fs/promises");

const getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await fs.readFile("./endpoints.json");

    res.status(200).send(JSON.parse(endpoints));
  } catch (err) {
    next(err);
  }
};

apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/categories", categoriesRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
