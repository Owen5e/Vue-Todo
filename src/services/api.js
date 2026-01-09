const API_URL = "https://jsonplaceholder.typicode.com/todos";
const LOCAL_STORAGE_KEY = "todos";

const isLocalId = (id) => id > 1600000000000; // Timestamp-based IDs are local

export const api = {
  async getTodos(page = 1, limit = 10) {
    const start = (page - 1) * limit;

    // Check local storage first
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTodos && storedTodos.length > 0) {
      const paginatedTodos = storedTodos.slice(start, start + limit);
      return { data: paginatedTodos, total: storedTodos.length };
    }

    // Fallback to API call if no data in local storage
    const response = await fetch(`${API_URL}?_start=${start}&_limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    const total = response.headers.get("x-total-count");
    let data = await response.json();

    // Enhance API data with additional fields
    data = data.map((todo, index) => ({
      ...todo,
      description: `Description for task: ${todo.title}`,
      priority: ["low", "medium", "high"][index % 3],
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Save fetched data to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return { data, total: parseInt(total) || data.length };
  },

  async createTodo(todoData) {
    // For local todos, just create in local storage
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const enhancedTodo = {
      ...todoData,
      id: Date.now(), // Use timestamp as ID for local todos
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storedTodos.unshift(enhancedTodo);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedTodos));
    return enhancedTodo;
  },

  async updateTodo(id, todoData) {
    // Check if it's a local todo
    if (isLocalId(id)) {
      const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const index = storedTodos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        storedTodos[index] = { ...storedTodos[index], ...todoData, updatedAt: new Date().toISOString() };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedTodos));
        return storedTodos[index];
      }
      throw new Error("Todo not found");
    }

    // For API todos, make the API call
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
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const index = storedTodos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      storedTodos[index] = { ...storedTodos[index], ...todoData, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedTodos));
      return storedTodos[index];
    }

    return updatedTodo;
  },

  async deleteTodo(id) {
    // Check if it's a local todo
    if (isLocalId(id)) {
      const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const updatedTodos = storedTodos.filter((todo) => todo.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
      return true;
    }

    // For API todos, make the API call
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");

    // Update local storage
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const updatedTodos = storedTodos.filter((todo) => todo.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    return true;
  },
};
