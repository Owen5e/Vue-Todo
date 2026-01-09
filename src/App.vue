<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:max-w-4xl sm:mx-auto w-full px-4">
      <div
        class="relative px-4 md:px-8 py-10 bg-white md:mx-0 shadow-2xl rounded-3xl sm:p-10"
      >
        <div class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
              Todo App
            </h1>
            <p class="text-gray-500">Manage your tasks efficiently</p>
          </div>

          <!-- Error Alert -->
          <div
            v-if="error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span class="block sm:inline">{{ error }}</span>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p class="text-sm opacity-80">Total</p>
              <p class="text-2xl font-bold">{{ stats.total }}</p>
            </div>
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p class="text-sm opacity-80">Completed</p>
              <p class="text-2xl font-bold">{{ stats.completed }}</p>
            </div>
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p class="text-sm opacity-80">Active</p>
              <p class="text-2xl font-bold">{{ stats.active }}</p>
            </div>
            <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <p class="text-sm opacity-80">High Priority</p>
              <p class="text-2xl font-bold">{{ stats.high }}</p>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Search -->
              <div class="flex-grow">
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search todos..."
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <!-- Status Filter -->
              <select
                v-model="filterStatus"
                class="rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-4 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <!-- Priority Filter -->
              <select
                v-model="filterPriority"
                class="rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-4 py-2"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <!-- Delete Completed Button -->
              <button
                v-if="stats.completed > 0"
                @click="handleDeleteCompleted"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Completed
              </button>
            </div>
          </div>

          <TodoForm
            :todo="selectedTodo"
            @submit="handleSubmit"
            @cancel="selectedTodo = null"
          />

          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>

          <TodoList
            :todos="filteredTodos"
            @edit="selectedTodo = $event"
            @delete="handleDelete"
            @toggle="handleToggle"
          />

          <div v-if="!loading && filteredTodos.length === 0 && todos.length > 0" class="text-center py-8 text-gray-500">
            <p>No todos match your filters.</p>
          </div>

          <Pagination
            v-if="todos.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TodoList from "./components/TodoList.vue";
import TodoForm from "./components/TodoForm.vue";
import Pagination from "./components/Pagination.vue";
import { useTodos } from "./composables/useTodos";

const {
  todos,
  error,
  loading,
  selectedTodo,
  currentPage,
  totalPages,
  searchQuery,
  filterStatus,
  filterPriority,
  filteredTodos,
  stats,
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  deleteCompleted,
  toggleTodo,
  goToPage,
} = useTodos();

onMounted(() => {
  fetchTodos();
});

const handleSubmit = async (todoData) => {
  if (selectedTodo.value) {
    await updateTodo({ ...todoData, id: selectedTodo.value.id });
  } else {
    await addTodo(todoData);
  }
};

const handleDelete = async (id) => {
  await deleteTodo(id);
};

const handleDeleteCompleted = async () => {
  if (confirm("Are you sure you want to delete all completed todos?")) {
    await deleteCompleted();
  }
};

const handleToggle = async (todo) => {
  await toggleTodo(todo);
};

const handlePageChange = async (page) => {
  await goToPage(page);
};
</script>
