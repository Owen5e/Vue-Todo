<!-- src/App.vue -->
<template>
  <div
    class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div
        class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"
      >
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div
              class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <h1 class="text-3xl font-bold text-center mb-8 text-indigo-600">
                Todo App
              </h1>

              <!-- Error Alert -->
              <div
                v-if="error"
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span class="block sm:inline">{{ error }}</span>
              </div>

              <TodoForm
                :todo="selectedTodo"
                @submit="handleSubmit"
                @cancel="selectedTodo = null"
              />

              <div v-if="loading" class="flex justify-center py-4">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                ></div>
              </div>

              <TodoList
                :todos="todos"
                @edit="selectedTodo = $event"
                @delete="handleDelete"
                @toggle="handleToggle"
              />

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
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
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

const handleToggle = async (todo) => {
  await toggleTodo(todo);
};

const handlePageChange = async (page) => {
  await goToPage(page);
};
</script>
