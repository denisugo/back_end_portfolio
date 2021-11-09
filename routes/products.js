const express = require("express");
const router = express.Router();

const { selectByTableName } = require("../queries");
const db = require("../db");
const { constants } = require("../config");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const products = await selectByTableName(db, constants.tableNames.PRODUCTS);
  res.send(products);
});

module.exports = router;
