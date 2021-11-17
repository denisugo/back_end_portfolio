const express = require("express");
const {
  loginVerification,
  isAdminVerification,
} = require("../middlewares/loginMiddlewares");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send("products will be here");
});
router.get("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  res.send("products will be here, " + id);
});

router.post("/", loginVerification, isAdminVerification, (req, res, next) => {
  res.status(201).send("products will be here, " + req.body);
});

router.put("/:id", loginVerification, isAdminVerification, (req, res, next) => {
  res.send("products will be updated here, " + req.body);
});
router.delete(
  "/:id",
  loginVerification,
  isAdminVerification,
  (req, res, next) => {
    res.status(204).send("products will be deleted here");
  }
);

module.exports = router;
