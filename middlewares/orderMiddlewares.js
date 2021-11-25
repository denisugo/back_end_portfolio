const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");
const {
  executeQuery,
  selectByIdMultiple,
  selectOrdersByUserId,
  insertValues,
  updateValuesByIdAndProductId,
  deleteValuesByOrderId,
} = require("../queries");

//TODO: Should be checked if an order's user_id and req -> user -> id are the same

// This middleware will not be used in production
const getOrderByIdMiddleware = async (req, res, next) => {
  const tableName = tableNames.ORDERS;
  const role = roles.REGISTERED_ROLE;
  const id = req.params.id;
  const orders = await executeQuery(
    { db, role, tableName, id },
    selectByIdMultiple
  );

  if (orders) return res.send(orders);
};
const getOrdersByUserMiddleware = async (req, res, next) => {
  const user_id = req.user.id;
  const role = roles.REGISTERED_ROLE;
  const selected = await executeQuery(
    { db, role, user_id },
    selectOrdersByUserId
  );
  if (selected) {
    return res.send(selected);
  }
  return res.status(500).send("An error occured, please try again");
};

/**
 * Could be uset in the checkout endpoint
 */
const postOrderMiddleware = async (req, res, next) => {
  if (req.body) {
    const cart = req.body.cart;
    if (cart) {
      const user_id = req.user.id;
      const ordersUsersQueryValuesColumns = stringCreator.orders_users({
        user_id,
      });
      let tableName = tableNames.ORDERS_USERS;
      const role = roles.REGISTERED_ROLE;

      const { order_id } = await executeQuery(
        { db, tableName, role, ...ordersUsersQueryValuesColumns },
        insertValues
      );

      if (order_id) {
        tableName = tableNames.ORDERS;

        const allInsertedItems = [];

        for (const item of cart) {
          const orderObject = {
            id: order_id,
            ...item,
          };
          const ordersQueryValuesColumns = stringCreator.orders(orderObject);

          const inserted = await executeQuery(
            { db, tableName, role, ...ordersQueryValuesColumns },
            insertValues
          );

          allInsertedItems.push(inserted);
        }

        if (allInsertedItems && allInsertedItems.length === cart.length)
          return res.status(201).send("Your order has been placed");
      }
    }
  }
  return res.status(400).send("Check your cart");
};

/**
 *  Possibilities to change a quantity
 */
const putOrderMiddleware = async (req, res, next) => {
  const body = req.body;

  if (body) {
    const columnName = body.field;
    const newValue = body.value;
    const id = body.id;
    const product_id = body.product_id;

    if (columnName && newValue && id && product_id) {
      const role = roles.ADMIN_ROLE;
      const tableName = tableNames.ORDERS;

      const updated = await executeQuery(
        { db, role, tableName, columnName, newValue, id, product_id },
        updateValuesByIdAndProductId
      );

      if (updated) return res.send("Updated");
    }
  }

  return res.status(400).send("Cannot be updated");
};
const deleteOrderMiddleware = async (req, res, next) => {
  if (req.body) {
    const order_id = req.body.order_id;
    if (order_id) {
      const role = roles.ADMIN_ROLE;
      const tableName = tableNames.ORDERS_USERS;

      const deleted = await executeQuery(
        { db, tableName, role, order_id },
        deleteValuesByOrderId
      );
      if (deleted) return res.status(204).send("Successfully deleted");
    }
  }
  return res.status(400).send("The operation cannot be done");
};

module.exports = {
  getOrderByIdMiddleware,
  getOrdersByUserMiddleware,
  postOrderMiddleware,
  putOrderMiddleware,
  deleteOrderMiddleware,
};
