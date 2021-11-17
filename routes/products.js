const express = require("express");
const router = express.Router();

const db = require("../db");
const { constants } = require("../config");

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.send("products will be here");
});

module.exports = router;
