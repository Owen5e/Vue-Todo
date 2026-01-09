<template>
  <div class="space-y-4">
    <div v-if="todos.length === 0" class="text-center text-gray-500 py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-lg">No todos yet. Add one above!</p>
    </div>

    <div
      v-for="todo in todos"
      :key="todo.id"
      class="flex items-start p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
      :class="{ 'border-l-4 border-l-green-500': todo.completed, 'border-l-4 border-l-yellow-500': !todo.completed && todo.priority === 'high', 'border-l-4 border-l-blue-500': !todo.completed && todo.priority === 'medium', 'border-l-4 border-l-gray-400': !todo.completed && todo.priority === 'low' }"
    >
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo)"
        class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1 cursor-pointer"
      />

      <div class="flex-grow ml-4 min-w-0">
        <div class="flex items-center justify-between">
          <span
            :class="[
              'text-lg font-medium truncate',
              todo.completed ? 'line-through text-gray-400' : 'text-gray-800',
            ]"
          >
            {{ todo.title }}
          </span>
          <span
            class="ml-2 px-2 py-1 text-xs font-semibold rounded-full shrink-0"
            :class="{
              'bg-red-100 text-red-800': todo.priority === 'high',
              'bg-blue-100 text-blue-800': todo.priority === 'medium',
              'bg-gray-100 text-gray-800': todo.priority === 'low',
            }"
          >
            {{ todo.priority }}
          </span>
        </div>
        
        <p
          v-if="todo.description"
          :class="[
            'mt-1 text-sm truncate',
            todo.completed ? 'text-gray-300' : 'text-gray-500',
          ]"
        >
          {{ todo.description }}
        </p>

        <div class="mt-2 flex items-center text-xs text-gray-400 space-x-4">
          <span v-if="todo.createdAt">
            Created: {{ formatDate(todo.createdAt) }}
          </span>
        </div>
      </div>

      <div class="flex space-x-2 ml-4 shrink-0">
        <button
          @click="$emit('edit', todo)"
          class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          @click="$emit('delete', todo.id)"
          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  todos: {
    type: Array,
    required: true,
  },
});

defineEmits(["edit", "delete", "toggle"]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>
