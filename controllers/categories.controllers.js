const {
  selectCategories,
  insertCategory,
} = require("../models/categories.model");

exports.getCategories = async (req, res, next) => {
  const categories = await selectCategories();

  res.status(200).send({ categories });
};

exports.postCategory = async (req, res, next) => {
  const newCategory = req.body;

  try {
    const categories = await insertCategory(newCategory);
    res.status(201).send({ categories });
  } catch (err) {
    next(err);
  }
};
