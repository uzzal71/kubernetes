const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../modules/user/user.model');
const TokenBlacklist = require('../modules/token/tokenBlacklist.model');
const ApiError = require('../utils/ApiError');

async function isBlacklisted(token) {
  const found = await TokenBlacklist.findOne({ token }).lean();
  return !!found;
}

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) throw new ApiError(401, 'Missing Authorization token');

    if (await isBlacklisted(token)) throw new ApiError(401, 'Token is invalid (logged out)');

    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'User not found');
    if (user.disabled) throw new ApiError(403, 'Account disabled');

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired'));
    next(err);
  }
};