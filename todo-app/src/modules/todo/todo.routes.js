const express = require('express');
const router = express.Router();
const todoController = require('./todo.controller');
const auth = require('../../middlewares/auth');

// Protect all todo routes
router.use(auth);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
