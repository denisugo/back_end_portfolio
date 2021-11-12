/**
 * This function wiil check if user is already logged in
 */
const loginVerification = (req, res, next) => {
  try {
    if (req.user) return next();
  } catch (error) {
    console.error(error);
  }
  res.status(401).send("Unathorized");
};

const userIdVerification = (req, res, next) => {
  try {
    if (req.user.id === parseInt(req.params.id)) return next();
  } catch (error) {
    console.error(error);
  }

  res.status(401).send("Unathorized");
};

module.exports = { loginVerification, userIdVerification };
