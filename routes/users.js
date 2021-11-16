var express = require("express");
var router = express.Router();
const {
  loginVerification,
  userIdVerification,
  isAdminVerification,
} = require("../middlewares/loginMiddlewares");

const {
  deleteUserData,
  updateUserData,
  getUser,
} = require("../middlewares/userMiddleware");

/* GET user profile. */
router.get("/:id", loginVerification, userIdVerification, getUser);

/* PUT user profile. */
router.put("/:id", loginVerification, userIdVerification, updateUserData);

/* DELETE user profile. */
/* Only admins can delete a user */
router.delete(
  "/:id",
  loginVerification,
  userIdVerification,
  isAdminVerification,
  deleteUserData
);

module.exports = router;
