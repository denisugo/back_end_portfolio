var express = require("express");
const passport = require("passport");
const { registerMiddleware } = require("../middlewares/registerMiddlewares");
const router = express.Router();

// Flow: pasport deserialize(unsuccess)->register middlewere->passport auth(generates cookies)
router.post(
  "/",
  registerMiddleware,
  passport.authenticate("local", { session: true }),
  function (req, res, next) {
    res.send("registered");
  }
);

module.exports = router;
