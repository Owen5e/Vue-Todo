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
  const searchQuery = ref("");
  const filterStatus = ref("all"); // all, active, completed
  const filterPriority = ref("all"); // all, high, medium, low

  const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value)
  );

  const filteredTodos = computed(() => {
    let filtered = todos.value;

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (filterStatus.value === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filterStatus.value === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Filter by priority
    if (filterPriority.value !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filterPriority.value);
    }

    return filtered;
  });

  const stats = computed(() => {
    const allTodos = todos.value;
    return {
      total: allTodos.length,
      completed: allTodos.filter((t) => t.completed).length,
      active: allTodos.filter((t) => !t.completed).length,
      high: allTodos.filter((t) => t.priority === "high").length,
      medium: allTodos.filter((t) => t.priority === "medium").length,
      low: allTodos.filter((t) => t.priority === "low").length,
    };
  });

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
      const newTodo = await api.createTodo({
        ...todoData,
        createdAt: new Date().toISOString(),
      });
      todos.value = [newTodo, ...todos.value];
      totalItems.value = todos.value.length;
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
      const updatedTodo = await api.updateTodo(todoData.id, {
        ...todoData,
        updatedAt: new Date().toISOString(),
      });
      const index = todos.value.findIndex((t) => t.id === todoData.id);
      if (index !== -1) {
        // Create a new array to ensure reactivity
        const newTodos = [...todos.value];
        newTodos[index] = updatedTodo;
        todos.value = newTodos;
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
      todos.value = todos.value.filter((t) => t.id !== id);
      totalItems.value = todos.value.length;
    } catch (e) {
      error.value = "Failed to delete todo";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const deleteCompleted = async () => {
    loading.value = true;
    error.value = null;
    try {
      const completedIds = todos.value.filter((t) => t.completed).map((t) => t.id);
      for (const id of completedIds) {
        await api.deleteTodo(id);
      }
      todos.value = todos.value.filter((t) => !t.completed);
      totalItems.value = todos.value.length;
    } catch (e) {
      error.value = "Failed to delete completed todos";
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
  };
}
