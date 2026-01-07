<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold text-center">CheckHTML</h1>

      <UrlForm @added="loadUrls" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UrlList :urls="urls" @select="selectUrl" @deleted="handleUrlDeleted" />

        <CheckList
          v-if="selectedUrl"
          :checks="checks"
          :url="selectedUrl.url"
          @close="closeChecks"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from './services/api'

import UrlForm from './components/UrlForm.vue'
import UrlList from './components/UrlList.vue'
import CheckList from './components/CheckList.vue'

const urls = ref([])
const checks = ref([])
const selectedUrl = ref(null)
let intervalId = null

async function loadUrls() {
  const res = await api.get('/urls')
  urls.value = res.data
}

async function loadChecks() {
  if (!selectedUrl.value) return

  const res = await api.get(`/checks/${selectedUrl.value._id}`)
  checks.value = res.data
}

function closeChecks() {
  selectedUrl.value = null
  checks.value = []

  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

async function selectUrl(url) {
  selectedUrl.value = url
  loadChecks()

  // očisti stari interval ako postoji
  if (intervalId) {
    clearInterval(intervalId)
  }

  // polling svakih 10 sekundi
  intervalId = setInterval(loadChecks, 10000)
}

function handleUrlDeleted() {
  loadUrls() // osvježi listu URL-ova
  closeChecks() // zatvori checkove ako su otvoreni
}

onMounted(loadUrls)

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
