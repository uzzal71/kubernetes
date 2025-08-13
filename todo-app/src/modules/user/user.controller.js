const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('./user.model');
const TokenBlacklist = require('../token/tokenBlacklist.model');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');

const signToken = (userId) =>
  jwt.sign({ sub: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'email and password required');

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());
  res.status(201).json(new ApiResponse(201, { token }));
});

exports.signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.disabled) throw new ApiError(403, 'Account disabled');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(user._id.toString());
  res.json(new ApiResponse(200, { token }));
});

exports.logout = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new ApiError(400, 'No token to logout');

  // Decode to get exp so blacklist TTL matches token lifetime
  const decoded = jwt.decode(token);
  const expMs = decoded && decoded.exp ? decoded.exp * 1000 : Date.now();

  await TokenBlacklist.create({ token, expiresAt: new Date(expMs) });
  res.json(new ApiResponse(200, { loggedOut: true }));
});

exports.me = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(new ApiResponse(200, user));
});

exports.updateMe = catchAsync(async (req, res) => {
  const allowed = ['name', 'email', 'password'];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  if (Object.keys(updates).length === 0) throw new ApiError(400, 'No valid fields to update');

  const user = await User.findById(req.user.id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  Object.assign(user, updates);
  await user.save(); // will hash if password changed
  res.json(new ApiResponse(200, { updated: true }));
});

exports.disableMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { disabled: true });
  res.json(new ApiResponse(200, { disabled: true }));
});