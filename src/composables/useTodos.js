import { ref, computed } from "vue";
import { api } from "../services/api";

export function useTodos() {
  const todos = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const selectedTodo = ref(null);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = ref(10);

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const fetchTodos = async (page = currentPage.value) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, total } = await api.getTodos(page, itemsPerPage.value);
      todos.value = data;
      totalItems.value = total;
      currentPage.value = page;
    } catch (e) {
      error.value = "Failed to fetch todos";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const addTodo = async (todoData) => {
    loading.value = true;
    error.value = null;
    try {
      const newTodo = await api.createTodo(todoData);
      todos.value = [newTodo, ...todos.value]; // Prepend the new todo to the list
    } catch (e) {
      error.value = "Failed to add todo";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const updateTodo = async (todoData) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedTodo = await api.updateTodo(todoData.id, todoData);
      const index = todos.value.findIndex((t) => t.id === todoData.id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
      selectedTodo.value = null;
    } catch (e) {
      error.value = "Failed to update todo";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const deleteTodo = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await api.deleteTodo(id);
      await fetchTodos(currentPage.value); // Refresh current page after deletion
    } catch (e) {
      error.value = "Failed to delete todo";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const toggleTodo = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodo(updatedTodo);
  };

  const goToPage = async (page) => {
    if (page >= 1 && page <= totalPages.value) {
      await fetchTodos(page);
    }
  };

  return {
    todos,
    error,
    loading,
    selectedTodo,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    goToPage,
  };
}
