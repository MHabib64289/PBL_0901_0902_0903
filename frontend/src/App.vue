<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold text-center text-indigo-600">📚 Manajemen Buku</h1>

    <!-- Form Tambah/Update Buku -->
    <form @submit.prevent="isEdit ? updateBook() : createBook()" class="space-y-4">
      <div class="grid sm:grid-cols-3 gap-3">
        <input
          v-model="form.title"
          placeholder="Judul"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          v-model="form.author"
          placeholder="Penulis"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          v-model="form.year"
          type="number"
          placeholder="Tahun"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {{ isEdit ? 'Update' : 'Tambah' }}
        </button>
        <button
          v-if="isEdit"
          @click="cancelEdit"
          type="button"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </form>

    <!-- Pencarian Buku -->
    <input
      v-model="search"
      @input="fetchBooks"
      placeholder="🔍 Cari buku..."
      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <!-- Daftar Buku -->
    <ul class="space-y-4">
      <li
        v-for="book in books"
        :key="book._id"
        class="bg-white p-4 rounded-lg shadow flex justify-between items-center"
      >
        <div>
          <h2 class="font-semibold text-lg text-gray-800">{{ book.title }}</h2>
          <p class="text-sm text-gray-600">{{ book.author }} • {{ book.year }}</p>
        </div>
        <div class="space-x-2">
          <button
            @click="editBook(book)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            @click="deleteBook(book._id)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </li>
    </ul>

    <!-- Komponen Log -->
    <LogView :refreshFlag="refreshFlag" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LogView from './components/LogView.vue'

const form = ref({ title: '', author: '', year: '' })
const books = ref([])
const isEdit = ref(false)
const editId = ref(null)
const search = ref('')
const refreshFlag = ref(0)

const fetchBooks = async () => {
  const url = search.value
    ? `http://localhost:3001/books/search?q=${search.value}`
    : `http://localhost:3001/books`
  const res = await axios.get(url)
  books.value = res.data
}

const triggerLogRefresh = () => {
  refreshFlag.value++
}

const createBook = async () => {
  await axios.post('http://localhost:3001/books', form.value)
  form.value = { title: '', author: '', year: '' }
  fetchBooks()
  triggerLogRefresh()
}

const editBook = (book) => {
  form.value = { title: book.title, author: book.author, year: book.year }
  editId.value = book._id
  isEdit.value = true
}

const updateBook = async () => {
  await axios.put(`http://localhost:3002/books/${editId.value}`, form.value)
  cancelEdit()
  fetchBooks()
  triggerLogRefresh()
}

const deleteBook = async (id) => {
  if (confirm('Yakin ingin menghapus buku ini?')) {
    await axios.delete(`http://localhost:3002/books/${id}`)
    fetchBooks()
    triggerLogRefresh()
  }
}

const cancelEdit = () => {
  form.value = { title: '', author: '', year: '' }
  isEdit.value = false
  editId.value = null
}

onMounted(fetchBooks)
</script>

<style scoped>

</style>
