<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">
        {{ todo ? "Edit Todo" : "New Todo" }}
      </label>
      <input
        type="text"
        id="title"
        v-model="todoTitle"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 outline-none pl-1"
        :placeholder="todo ? 'Edit todo item...' : 'Add new todo item...'"
      />
    </div>

    <div class="flex space-x-2">
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {{ todo ? "Update" : "Add" }}
      </button>

      <button
        v-if="todo"
        type="button"
        @click="$emit('cancel')"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  todo: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const todoTitle = ref("");

watch(
  () => props.todo,
  (newTodo) => {
    todoTitle.value = newTodo ? newTodo.title : "";
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (todoTitle.value.trim()) {
    emit("submit", {
      title: todoTitle.value.trim(),
      completed: props.todo?.completed ?? false,
    });
    if (!props.todo) {
      todoTitle.value = "";
    }
  }
};
</script>
