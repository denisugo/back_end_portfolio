var express = require("express");
var router = express.Router();
const {
  loginVerification,
  userIdVerification,
} = require("../handlers/loginHandlers");

/* GET user profile. */
router.get(
  "/:id",
  loginVerification,
  userIdVerification,
  function (req, res, next) {
    res.send(req.user);
  }
);

//TODO: post
//TODO: delete
//TODO: put

module.exports = router;
