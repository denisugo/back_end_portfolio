const express = require("express");
const router = express.Router();
const passport = require("passport");

/* GET login page. */
router.get("/", (req, res, next) => {
  res.send("login will be here");
});
// TODO: add middlewere that checks if a user is already logged in
router.post(
  "/",
  passport.authenticate("local", { session: true }),
  (req, res, next) => {
    res.send("logged in");
  }
);

module.exports = router;
