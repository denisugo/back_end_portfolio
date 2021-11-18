const {
  executeQuery,
  selectByCategory,
  selectByTableName,
  selectById,
} = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;

const tableName = tableNames.PRODUCTS;

const getProductsByCategoryMiddleware = async (req, res, next) => {
  const category = req.query.category;
  const role = roles.PUBLIC_ROLE;

  const selected = await executeQuery(
    { db, role, tableName, category },
    selectByCategory
  );

  if (selected) return res.send(selected);

  const allProducts = await executeQuery(
    { db, role, tableName },
    selectByTableName
  );

  if (allProducts) return res.send(allProducts);

  return res.status(500).send("");
};

const getProductByIdMiddleware = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const role = roles.PUBLIC_ROLE;
  const selected = await executeQuery({ db, tableName, role, id }, selectById);

  if (selected) return res.send(selected);

  return res.status(404).send("Not found");
};

const postProductMiddleware = (req, res, next) => {};
const putProductMiddleware = (req, res, next) => {};
const deleteProductMiddleware = (req, res, next) => {};

module.exports = {
  getProductsByCategoryMiddleware,
  getProductByIdMiddleware,
  postProductMiddleware,
  putProductMiddleware,
  deleteProductMiddleware,
};
