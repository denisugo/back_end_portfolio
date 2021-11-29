const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");
const {
  executeQuery,
  selectByUserId,
  insertValues,
  updateValuesByUserIdAndProductId,
  deleteValuesByUserIdAndProductId,
} = require("../queries");

const role = roles.REGISTERED_ROLE;
const tableName = tableNames.CARTS;

const getCartByUserMiddleware = async (req, res, nex) => {
  const user_id = req.user.id;

  const selected = await executeQuery(
    { db, role, tableName, user_id },
    selectByUserId
  );

  if (selected) {
    return res.send(selected);
  }
};

const postCartMiddleware = async (req, res, nex) => {
  //insertValues
  const user_id = req.user.id;
  const body = req.body;
  if (body) {
    if (body.product_id && body.quantity) {
      body.user_id = user_id;

      const newItem = stringCreator.cart(body);

      const inserted = await executeQuery(
        { db, tableName, role, ...newItem },
        insertValues
      );

      if (inserted) {
        return res.status(201).send("Added to the cart");
      }
    }
  }

  return res.status(400).send("Check your cart");
};

const putCartMiddleware = async (req, res, nex) => {
  const user_id = req.user.id;
  const body = req.body;

  if (body) {
    const newValue = body.value;
    const columnName = body.field;
    const product_id = body.product_id;
    if (newValue && columnName && product_id) {
      const updated = executeQuery(
        { db, tableName, role, newValue, columnName, product_id, user_id },
        updateValuesByUserIdAndProductId
      );

      if (updated) return res.send("Updated");
    }
  }
  return res.status(400).send("Cannot be updated");
};

const deleteCartMiddleware = async (req, res, nex) => {
  const user_id = req.user.id;
  const body = req.body;
  if (body) {
    const product_id = body.product_id;
    if (product_id) {
      const deleted = executeQuery(
        { db, tableName, role, user_id, product_id },
        deleteValuesByUserIdAndProductId
      );
      if (deleted) return res.status(204).send("Successfully deleted");
    }
  }
  return res.status(400).send("The operation cannot be done");
};

module.exports = {
  getCartByUserMiddleware,
  postCartMiddleware,
  putCartMiddleware,
  deleteCartMiddleware,
};
