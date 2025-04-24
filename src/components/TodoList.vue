<!-- src/components/TodoList.vue -->
<template>
  <div class="space-y-4">
    <div v-if="todos.length === 0" class="text-center text-gray-500">
      No todos yet. Add one above!
    </div>
    
    <div v-for="todo in todos" :key="todo.id" 
      class="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo)"
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      >
      
      <span
        :class="[
          'flex-grow mx-4',
          todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
        ]"
      >
        {{ todo.title }}
      </span>

      <div class="flex space-x-2">
        <button
          @click="$emit('edit', todo)"
          class="text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          @click="$emit('delete', todo.id)"
          class="text-red-600 hover:text-red-800"
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
    required: true
  }
})

defineEmits(['edit', 'delete', 'toggle'])
</script>