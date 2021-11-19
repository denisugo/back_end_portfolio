const {
  executeQuery,
  selectByCategory,
  selectByTableName,
  selectById,
  insertValues,
} = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");

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

const postProductMiddleware = async (req, res, next) => {
  if (req.body) {
    const body = req.body;
    if (
      body.name &&
      body.description &&
      body.price &&
      body.category &&
      body.preview
    ) {
      const role = roles.ADMIN_ROLE;
      const { columns, values, queryPrepared } = stringCreator.products(body);
      const inserted = await executeQuery(
        { db, tableName, role, columns, values, queryPrepared },
        insertValues
      );
      if (inserted) {
        const allProducts = await executeQuery(
          { db, role, tableName },
          selectByTableName
        );

        if (allProducts) return res.status(201).send(allProducts);
      }
    }
  }
  return res.status(400).send("Check your input");
};

const putProductMiddleware = async (req, res, next) => {};
const deleteProductMiddleware = async (req, res, next) => {};

module.exports = {
  getProductsByCategoryMiddleware,
  getProductByIdMiddleware,
  postProductMiddleware,
  putProductMiddleware,
  deleteProductMiddleware,
};
