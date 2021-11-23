const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");
const { executeQuery, selectByIdMultiple } = require("../queries");

//TODO: Should be checked if an order's user_id and req -> user -> id are the same
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
const getOrdersByUserMiddleware = async (req, res, next) => {};
const postOrderMiddleware = async (req, res, next) => {};
const putOrderByIdMiddleware = async (req, res, next) => {};
const deleteOrderByIdMiddleware = async (req, res, next) => {};

module.exports = {
  getOrderByIdMiddleware,
  getOrdersByUserMiddleware,
  postOrderMiddleware,
  putOrderByIdMiddleware,
  deleteOrderByIdMiddleware,
};
