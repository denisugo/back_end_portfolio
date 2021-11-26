/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - password
 *          - first_name
 *          - last_name
 *          - email
 *        properties:
 *          id:
 *            type: integer
 *            description: The user's ID
 *          username:
 *            type: string
 *            description: The user's username
 *          password:
 *            type: string
 *            description: The user's password
 *          first_name:
 *            type: string
 *            description: The user's first_name
 *          last_name:
 *            type: string
 *            description: The user's last_name
 *          email:
 *            type: string
 *            description: The user's email
 *          is_admin:
 *            type: string
 *            description: Indicates whether the user is an admin or not
 */

const express = require("express");
const router = express.Router();
const {
  loginVerification,
  userIdVerification,
  isAdminVerification,
} = require("../middlewares/loginMiddlewares");

const {
  deleteUserMiddleware,
  updateUserMiddleware,
  getUserMiddleware,
} = require("../middlewares/userMiddlewares");

const ordersRouter = require("./orders");
const cartRouter = require("./cart");
// orders endpoint
router.use("/:id/orders", ordersRouter);
// cart endpoint
router.use("/:id/cart", cartRouter);

/* GET user profile. */
router.get("/:id", loginVerification, userIdVerification, getUserMiddleware);

/* PUT user profile. */
router.put("/:id", loginVerification, userIdVerification, updateUserMiddleware);

/* DELETE user profile. */
/* Only admins can delete a user */
router.delete(
  "/:id",
  loginVerification,
  userIdVerification,
  isAdminVerification,
  deleteUserMiddleware
);

module.exports = router;
