<template>
  <div class="bg-gray-50 p-4 rounded shadow max-w-4xl mx-auto mt-10">
    <h2 class="text-xl font-semibold mb-4 text-indigo-700">📜 Riwayat Aktivitas</h2>
    <ul class="space-y-2">
      <li
        v-for="log in logs"
        :key="log._id"
        class="bg-white p-3 rounded border border-gray-200 shadow-sm"
      >
        <div class="font-medium">{{ log.action }} - {{ log.target }}</div>
        <div class="text-sm text-gray-600">{{ log.description }}</div>
        <div class="text-xs text-gray-400">{{ formatDate(log.timestamp) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref([])

const fetchLogs = async () => {
  try {
    const res = await axios.get('http://localhost:3003/logs')
    logs.value = res.data // supaya yang terbaru tampil duluan
  } catch (error) {
    console.error('Gagal memuat log:', error.message)
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return isNaN(date) ? 'Tanggal tidak valid' : date.toLocaleString('id-ID')
}

onMounted(fetchLogs)
</script>

<style scoped>
/* Styling langsung ditangani Tailwind di class */
</style>
