<template>
  <div v-if="checks.length" class="bg-white p-6 rounded-xl shadow relative">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold uppercase break-all">
        {{ url }}
      </h2>

      <button
        @click="$emit('close')"
        class="text-sm text-gray-500 hover:text-red-600 cursor-pointer font-bold"
        title="Close"
      >
        ✕
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-sm text-gray-600">
            <th>Status</th>
            <th>HTML size</th>
            <th>Links</th>
            <th>Checked at</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in checks" :key="c._id" class="border-b last:border-0">
            <td>
              <span :class="statusClass(c.statusCode)" class="rounded text-sm font-semibold">
                {{ c.statusCode }}
              </span>
            </td>

            <td>{{ c.htmlSize }}</td>
            <td>{{ c.linkCount }}</td>
            <td>{{ new Date(c.checkedAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  checks: Array,
  url: String,
})

defineEmits(['close'])

function statusClass(status) {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-700'
  }
  if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-700'
  }
  if (status >= 400 && status < 500) {
    return 'bg-orange-100 text-orange-700'
  }
  if (status >= 500) {
    return 'bg-red-100 text-red-700'
  }
  return 'bg-gray-100 text-gray-700'
}
</script>
