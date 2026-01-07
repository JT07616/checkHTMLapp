<template>
  <div class="bg-white p-6 rounded-xl shadow">
    <h2 class="text-lg font-semibold mb-4">Add URL</h2>

    <div class="flex gap-2">
      <input
        v-model="url"
        type="text"
        placeholder="https://example.com"
        class="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />

      <button
        type="button"
        @click="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const emit = defineEmits(['added'])
const url = ref('')

async function submit() {
  if (!url.value) return

  await api.post('/urls', { url: url.value })
  url.value = ''
  emit('added')
}
</script>
