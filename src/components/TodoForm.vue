<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">
        {{ todo ? "Edit Todo" : "New Todo" }}
      </label>
      <input
        type="text"
        id="title"
        v-model="formData.title"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 outline-none pl-3 py-2"
        :placeholder="todo ? 'Edit todo item...' : 'Add new todo item...'"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="2"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 outline-none pl-3 py-2"
        placeholder="Add a description..."
      ></textarea>
    </div>

    <div>
      <label for="priority" class="block text-sm font-medium text-gray-700">
        Priority
      </label>
      <select
        id="priority"
        v-model="formData.priority"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 outline-none pl-3 py-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div class="flex space-x-2">
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 mb-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
import { ref, watch, reactive } from "vue";

const props = defineProps({
  todo: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = reactive({
  title: "",
  description: "",
  priority: "medium",
});

watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      formData.title = newTodo.title || "";
      formData.description = newTodo.description || "";
      formData.priority = newTodo.priority || "medium";
    } else {
      formData.title = "";
      formData.description = "";
      formData.priority = "medium";
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (formData.title.trim()) {
    emit("submit", {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      completed: props.todo?.completed ?? false,
    });
    if (!props.todo) {
      formData.title = "";
      formData.description = "";
      formData.priority = "medium";
    }
  }
};
</script>
