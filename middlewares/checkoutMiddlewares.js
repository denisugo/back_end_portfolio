const generateId = () => {
  return Math.floor(Math.random() * Date.now()) + Date.now();
};

const postCheckoutMiddleware = (req, res, next) => {
  const transaction_id = generateId();
  req.body.transaction_id = transaction_id;
  res.redirect(307, `/api/v1/users/${req.user.id}/orders`);
};

module.exports = { postCheckoutMiddleware };
