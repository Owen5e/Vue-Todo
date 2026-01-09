const API_URL = "https://jsonplaceholder.typicode.com/todos";
const LOCAL_STORAGE_KEY = "todos";

const isLocalId = (id) => id > 1600000000000; // Timestamp-based IDs are local

// English task templates for enhanced data
const taskTemplates = [
  { title: "Complete project documentation", desc: "Write comprehensive documentation for the project including setup instructions and API references" },
  { title: "Review code changes", desc: "Review and approve the pull request with all necessary code changes" },
  { title: "Update dependencies", desc: "Check for outdated packages and update to the latest stable versions" },
  { title: "Write unit tests", desc: "Create comprehensive unit tests for the new feature module" },
  { title: "Fix bug in login flow", desc: "Resolve the authentication issue reported by users on the login page" },
  { title: "Optimize database queries", desc: "Improve query performance for the dashboard page to reduce load time" },
  { title: "Design new dashboard layout", desc: "Create wireframes and mockups for the redesigned dashboard interface" },
  { title: "Implement dark mode", desc: "Add dark mode support to the application with user preference toggle" },
  { title: "Set up CI/CD pipeline", desc: "Configure continuous integration and deployment for automated testing and release" },
  { title: "Conduct code review", desc: "Perform thorough code review for the new feature implementation" },
  { title: "Update API documentation", desc: "Document the new endpoints added in the latest release" },
  { title: "Fix responsive layout issues", desc: "Resolve styling problems on mobile devices and tablets" },
  { title: "Add error handling", desc: "Implement proper error boundaries and fallback UI for unexpected errors" },
  { title: "Configure logging system", desc: "Set up structured logging to track application events and errors" },
  { title: "Implement caching strategy", desc: "Add Redis caching for frequently accessed data to improve performance" },
  { title: "Security audit", desc: "Conduct a security review to identify and fix potential vulnerabilities" },
  { title: "Update user interface", desc: "Refresh the UI with modern design principles and better usability" },
  { title: "Add notification system", desc: "Implement in-app notification feature for user alerts and updates" },
  { title: "Refactor legacy code", desc: "Modernize the old codebase to follow current best practices" },
  { title: "Set up monitoring", desc: "Configure application monitoring and alerting for production environment" },
];

const priorities = ["high", "medium", "low"];

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
    const data = await response.json();

    // Enhance API data with meaningful English content
    const enhancedData = data.map((todo, index) => {
      const template = taskTemplates[index % taskTemplates.length];
      return {
        ...todo,
        title: template.title,
        description: template.desc,
        priority: priorities[index % 3],
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Save fetched data to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(enhancedData));
    return { data: enhancedData, total: parseInt(total) || enhancedData.length };
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
