const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/todos.json');

const readTodos = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeTodos = (todos) => {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

router.get('/', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

router.post('/', (req, res) => {
  const todos = readTodos();
  const newTodo = { id: Date.now(), ...req.body, completed: false };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

router.put('/:id', (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === parseInt(req.params.id));
  if (index !== -1) {
    todos[index] = { ...todos[index], ...req.body };
    writeTodos(todos);
    res.json(todos[index]);
  } else {
    res.status(404).send('Todo not found');
  }
});

router.delete('/:id', (req, res) => {
  const todos = readTodos();
  const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.params.id));
  writeTodos(filteredTodos);
  res.status(204).send();
});

module.exports = router;
