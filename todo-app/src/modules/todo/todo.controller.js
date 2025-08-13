const Todo = require('./todo.model');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');

// Create a new todo
exports.createTodo = catchAsync(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, 'Title is required');
  }

  const todo = await Todo.create({
    title,
    description,
    user: req.user.id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, todo, 'Todo created successfully'));
});

// Get all todos for the authenticated user
exports.getTodos = catchAsync(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });

  res
    .status(200)
    .json(new ApiResponse(200, todos, 'Todos fetched successfully'));
});

// Get a single todo by ID (only if it belongs to the user)
exports.getTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

  if (!todo) {
    throw new ApiError(404, 'Todo not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, todo, 'Todo fetched successfully'));
});

// Update a todo (only if it belongs to the user)
exports.updateTodo = catchAsync(async (req, res) => {
  const { title, description, completed } = req.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, description, completed },
    { new: true, runValidators: true }
  );

  if (!todo) {
    throw new ApiError(404, 'Todo not found or not authorized');
  }

  res
    .status(200)
    .json(new ApiResponse(200, todo, 'Todo updated successfully'));
});

// Delete a todo (only if it belongs to the user)
exports.deleteTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!todo) {
    throw new ApiError(404, 'Todo not found or not authorized');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Todo deleted successfully'));
});
