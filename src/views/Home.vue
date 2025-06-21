<template>
  <div
    :class="{
      'min-h-screen flex items-center justify-center p-4': true,
      'bg-yellow-100': weather && weather.weather[0].main === 'Clear',
      'bg-gray-200': weather && weather.weather[0].main === 'Clouds',
      'bg-blue-100': weather && weather.weather[0].main === 'Rain',
      'bg-gray-100': !weather
    }"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-4">
        Weather Web
      </h1>
      <div class="mb-4">
        <input
          v-model="city"
          @keyup.enter="fetchOrRefreshWeather"
          type="text"
          placeholder="Masukkan nama kota"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          @input="validateCity"
        />
        <p v-if="cityError" class="text-red-500 text-sm mt-1">{{ cityError }}</p>
      </div>
      <button
        @click="fetchOrRefreshWeather"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mb-4"
      >
        Cari Cuaca
      </button>
      <transition name="fade">
        <div v-if="weather">
          <WeatherCard :weather="weather" />
          <h2 class="text-xl font-semibold mt-4">Prakiraan 5 Hari</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div v-for="(day, index) in forecast" :key="index" class="p-2 bg-gray-50 rounded">
              <p>{{ new Date(day.dt_txt).toLocaleDateString('id-ID', { weekday: 'long' }) }}</p>
              <p>{{ Math.round(day.main.temp) }}°C</p>
              <p class="capitalize">{{ day.weather[0].description }}</p>
            </div>
          </div>
        </div>
      </transition>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      <LoadingSpinner v-if="loading" class="mt-4" />
    </div>
  </div>
</template>

<script>
import WeatherCard from '../components/WeatherCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { fetchWeather, fetchForecast } from '../services/weatherService';

export default {
  components: { WeatherCard, LoadingSpinner },
  data() {
    return {
      city: '',
      weather: null,
      forecast: [],
      error: '',
      loading: false,
      cityError: '',
      refreshInterval: null,
    };
  },
  methods: {
    validateCity() {
      const cityPattern = /^[a-zA-Z\s,]+$/;
      if (this.city && !cityPattern.test(this.city)) {
        this.cityError = 'Kota hanya boleh berisi huruf dan spasi!';
      } else if (this.city.length < 2) {
        this.cityError = 'Kota minimal 2 huruf!';
      } else {
        this.cityError = '';
      }
    },
    async fetchOrRefreshWeather() {
      if (this.cityError || !this.city) {
        this.error = 'Masukkan kota yang valid!';
        return;
      }
      this.loading = true;
      this.error = '';
      try {
        const apiKey = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY';
        this.weather = await fetchWeather(this.city, apiKey);
        this.forecast = await fetchForecast(this.city, apiKey);
      } catch (err) {
        this.error = err.message;
        this.weather = null;
        this.forecast = [];
      } finally {
        this.loading = false;
      }
    },
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        if (this.city) {
          this.fetchOrRefreshWeather();
        }
      }, 10 * 60 * 1000); // 10 menit dalam milidetik
    },
  },
  mounted() {
    this.startAutoRefresh();
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval); // Hentikan interval saat komponen dihancurkan
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