const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const api = {
  async getTodos(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const response = await fetch(`${API_URL}?_start=${start}&_limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    const total = response.headers.get("x-total-count");
    const data = await response.json();
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
    return await response.json();
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
    return await response.json();
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");
    return true;
  },
};
