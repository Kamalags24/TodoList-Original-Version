<template>
  <div>
    <h1>Todo List</h1>
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add a new task" />
      <button type="submit">Add Task</button>
    </form>
    <div>
      <button @click="filterTodos('all')">All</button>
      <button @click="filterTodos('completed')">Completed</button>
      <button @click="filterTodos('pending')">Pending</button>
    </div>
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
        <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
        <button @click="editMode(todo)">Edit</button>
        <button @click="confirmDelete(todo.id)">Delete</button>
        <div v-if="editingTodo === todo.id">
          <input v-model="editTitle" />
          <button @click="confirmUpdate(todo)">Save</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [],
      newTodo: '',
      filter: 'all',
      editingTodo: null,
      editTitle: ''
    };
  },
  computed: {
    filteredTodos() {
      if (this.filter === 'completed') {
        return this.todos.filter(todo => todo.completed);
      } else if (this.filter === 'pending') {
        return this.todos.filter(todo => !todo.completed);
      } else {
        return this.todos;
      }
    }
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      const response = await axios.get('/api/todos');
      this.todos = response.data;
    },
    async addTodo() {
      const response = await axios.post('/api/todos', { title: this.newTodo });
      this.todos.push(response.data);
      this.newTodo = '';
    },
    async updateTodo(todo) {
      await axios.put(`/api/todos/${todo.id}`, todo);
    },
    async deleteTodo(id) {
      await axios.delete(`/api/todos/${id}`);
      this.todos = this.todos.filter(todo => todo.id !== id);
    },
    confirmUpdate(todo) {
      if (confirm("Voulez-vous vraiment modifier cette tâche ?")) {
        todo.title = this.editTitle;
        this.updateTodo(todo);
        this.editingTodo = null;
        this.editTitle = '';
      }
    },
    confirmDelete(id) {
      if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        this.deleteTodo(id);
      }
    },
    editMode(todo) {
      this.editingTodo = todo.id;
      this.editTitle = todo.title;
    },
    filterTodos(filter) {
      this.filter = filter;
    }
  }
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
