<template>
  <div class="container">
    <h1 class="title">Todo List</h1>
    <form @submit.prevent="addTodo" class="add-task-form">
      <input v-model="newTodo" placeholder="Add a new task" class="input-task"/>
      <button type="submit" class="btn btn-add">Add Task</button>
    </form>
    <div class="filter-buttons">
      <button @click="filterTodos('all')" :class="{ active: filter === 'all' }">All</button>
      <button @click="filterTodos('completed')" :class="{ active: filter === 'completed' }">Completed</button>
      <button @click="filterTodos('pending')" :class="{ active: filter === 'pending' }">Pending</button>
    </div>
    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
        <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        <button @click="editMode(todo)" class="btn btn-edit">✏️</button>
        <button @click="confirmDelete(todo.id)" class="btn btn-delete">🗑️</button>
        <div v-if="editingTodo === todo.id" class="edit-mode">
          <input v-model="editTitle" class="input-edit" />
          <button @click="confirmUpdate(todo)" class="btn btn-save">Save</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const todos = ref([]);
const newTodo = ref('');
const filter = ref('all');
const editingTodo = ref(null);
const editTitle = ref('');

const filteredTodos = computed(() => {
  if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.completed);
  } else if (filter.value === 'pending') {
    return todos.value.filter(todo => !todo.completed);
  } else {
    return todos.value;
  }
});

onMounted(() => {
  fetchTodos();
});

const fetchTodos = async () => {
  const response = await axios.get('/api/todos');
  todos.value = response.data;
};

const addTodo = async () => {
  const response = await axios.post('/api/todos', { title: newTodo.value });
  todos.value.push(response.data);
  newTodo.value = '';
};

const updateTodo = async (todo) => {
  await axios.put(`/api/todos/${todo.id}`, todo);
};

const deleteTodo = async (id) => {
  await axios.delete(`/api/todos/${id}`);
  todos.value = todos.value.filter(todo => todo.id !== id);
};

const confirmUpdate = (todo) => {
  if (confirm("Voulez-vous vraiment modifier cette tâche ?")) {
    todo.title = editTitle.value;
    updateTodo(todo);
    editingTodo.value = null;
    editTitle.value = '';
  }
};

const confirmDelete = (id) => {
  if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
    deleteTodo(id);
  }
};

const editMode = (todo) => {
  editingTodo.value = todo.id;
  editTitle.value = todo.title;
};

const filterTodos = (selectedFilter) => {
  filter.value = selectedFilter;
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.add-task-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-task {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add {
  background-color: #4caf50;
  color: white;
}

.filter-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.filter-buttons button {
  background-color: #e0e0e0;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.filter-buttons button.active {
  background-color: #4caf50;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item .completed {
  text-decoration: line-through;
}

.btn-edit, .btn-delete {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.edit-mode {
  display: flex;
  align-items: center;
}

.input-edit {
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-save {
  background-color: #4caf50;
  color: white;
}
</style>
