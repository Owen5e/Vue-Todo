const API_URL = "https://jsonplaceholder.typicode.com/todos";
const LOCAL_STORAGE_KEY = "todos";

export const api = {
  async getTodos(page = 1, limit = 10) {
    const start = (page - 1) * limit;

    // Check local storage first
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTodos) {
      const paginatedTodos = storedTodos.slice(start, start + limit);
      return { data: paginatedTodos, total: storedTodos.length };
    }

    // Fallback to API call if no data in local storage
    const response = await fetch(`${API_URL}?_start=${start}&_limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    const total = response.headers.get("x-total-count");
    const data = await response.json();

    // Save fetched data to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return { data, total: parseInt(total) };
  },

  async createTodo(todoData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todoData,
        userId: 1,
      }),
    });
    if (!response.ok) throw new Error("Failed to create todo");
    const newTodo = await response.json();

    // Update local storage
    const storedTodos =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    storedTodos.unshift(newTodo);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedTodos));

    return newTodo;
  },

  async updateTodo(id, todoData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    const updatedTodo = await response.json();

    // Update local storage
    const storedTodos =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const index = storedTodos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      storedTodos[index] = updatedTodo;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedTodos));
    }

    return updatedTodo;
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");

    // Update local storage
    const storedTodos =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = storedTodos.filter((todo) => todo.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    return true;
  },
};
