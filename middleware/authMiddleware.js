const {successResponse,errorResponse} = require('../utils/responseWrapper')

const authMiddlerware = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // res.status(400).send("All fields are required.")
    // return;
    return res.send(errorResponse(400,"All fields are required.."))
  }
  next();
};

module.exports = authMiddlerware;
