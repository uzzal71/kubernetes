const express = require('express');
const auth = require('../../middlewares/auth');
const ctrl = require('./user.controller');

const router = express.Router();

// Auth
router.post('/auth/signup', ctrl.signup);
router.post('/auth/signin', ctrl.signin);
router.post('/auth/logout', auth, ctrl.logout);

// Profile
router.get('/users/me', auth, ctrl.me);
router.patch('/users/me', auth, ctrl.updateMe);
router.patch('/users/disable', auth, ctrl.disableMe);

module.exports = router;