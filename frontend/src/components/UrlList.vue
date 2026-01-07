<template>
  <div class="bg-white p-6 rounded-xl shadow">
    <h2 class="text-lg font-semibold mb-4">Tracked URLs</h2>

    <ul class="space-y-2">
      <li v-for="u in urls" :key="u._id" class="flex items-center justify-between p-2 rounded-lg">
        <span
          @click="$emit('select', u)"
          class="cursor-pointer break-all hover:bg-gray-100 p-1 rounded-2xl"
        >
          {{ u.url }}</span
        >
        <div class="flex items-center gap-2">
          <!-- ✎ edit -->
          <button
            @click.stop="editUrl(u)"
            class="text-gray-400 hover:text-blue-600 cursor-pointer"
            title="Edit URL"
          >
            ✎
          </button>

          <!-- ❌ delete -->
          <button
            @click.stop="deleteUrl(u._id)"
            class="text-gray-400 hover:text-red-600 cursor-pointer"
            title="Delete URL"
          >
            ✕
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import api from '../services/api'

defineProps({ urls: Array })
const emit = defineEmits(['select', 'deleted'])

async function deleteUrl(id) {
  const confirmed = window.confirm('Jeste li sigurni da želite izbrisati URL zapis?')

  if (!confirmed) return

  await api.delete(`/urls/${id}`)

  // obavijesti parent da se lista osvježi
  emit('deleted')
}

async function editUrl(urlObj) {
  const newUrl = window.prompt('Unesite novi URL:', urlObj.url)

  if (!newUrl || newUrl === urlObj.url) return

  await api.put(`/urls/${urlObj._id}`, {
    url: newUrl,
  })

  emit('deleted') // reuse: osvježava listu
}
</script>
