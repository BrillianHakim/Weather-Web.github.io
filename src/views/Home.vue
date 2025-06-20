<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-4">Weather Web</h1>
      <div class="mb-4">
        <input
          v-model="city"
          @keyup.enter="fetchWeather"
          type="text"
          placeholder="Masukkan nama kota"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        @click="fetchWeather"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Cari Cuaca
      </button>
      <transition name="fade">
        <WeatherCard v-if="weather" :weather="weather" />
      </transition>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      <LoadingSpinner v-if="loading" class="mt-4" />
    </div>
  </div>
</template>

<script>
import WeatherCard from '../components/WeatherCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { fetchWeather } from '../services/weatherService';

export default {
  components: { WeatherCard, LoadingSpinner },
  data() {
    return {
      city: '',
      weather: null,
      error: '',
      loading: false,
    };
  },
  methods: {
    async fetchWeather() {
      if (!this.city) {
        this.error = 'Masukkan nama kota!';
        return;
      }
      this.loading = true;
      this.error = '';
      try {
        const apiKey = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY';
        this.weather = await fetchWeather(this.city, apiKey);
      } catch (err) {
        this.error = err.message;
        this.weather = null;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>