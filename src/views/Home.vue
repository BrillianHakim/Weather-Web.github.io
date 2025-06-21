<template>
  <div
    :class="{
      'min-h-screen flex items-center justify-center p-4': true,
      'bg-yellow-100': !isDark && weather && weather.weather[0].main === 'Clear',
      'bg-gray-200': !isDark && weather && weather.weather[0].main === 'Clouds',
      'bg-blue-100': !isDark && weather && weather.weather[0].main === 'Rain',
      'bg-gray-100': !isDark && !weather,
      'bg-gray-900': isDark && weather && weather.weather[0].main === 'Clear',
      'bg-gray-800': isDark && weather && weather.weather[0].main === 'Clouds',
      'bg-blue-900': isDark && weather && weather.weather[0].main === 'Rain',
      'bg-gray-800': isDark && !weather
    }"
  >
    <div class="bg-white dark:bg-[#2d2d2d] p-6 rounded-lg shadow-lg w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Weather Web
        </h1>
        <label class="flex items-center space-x-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">Tema</span>
          <input type="checkbox" v-model="isDark" class="toggle-checkbox" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="mb-4 flex items-center">
        <input
          v-model="city"
          @keyup.enter="fetchOrRefreshWeather"
          type="text"
          placeholder="Masukkan nama kota"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
          @input="validateCity"
        />
      </div>
      <p v-if="cityError" class="text-red-500 dark:text-red-300 text-sm mt-1">{{ cityError }}</p>

      <button
        @click="fetchOrRefreshWeather"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mb-4 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Cari Cuaca
      </button>

      <transition name="fade">
        <div v-if="weather">
          <WeatherCard :weather="weather" />
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Prakiraan 5 Hari</h2>
            <div class="text-sm text-gray-700 dark:text-gray-200">
              {{ formattedDate }} {{ formattedTime }}
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <div v-for="(day, index) in forecast" :key="index" class="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <p class="text-gray-900 dark:text-white">{{ new Date(day.dt_txt).toLocaleDateString('id-ID', { weekday: 'long' }) }}</p>
              <p class="text-gray-900 dark:text-white">{{ Math.round(day.main.temp) }}°C</p>
              <p class="text-gray-900 dark:text-white capitalize">{{ day.weather[0].description }}</p>
            </div>
          </div>
          <transition name="alert-fade">
            <div v-if="showAlert" class="mt-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded">
              Peringatan: Cuaca ekstrem terdeteksi ({{ weather.weather[0].description }}). Hati-hati!
            </div>
          </transition>
        </div>
      </transition>
      <p v-if="error" class="text-red-500 dark:text-red-300 mt-4 text-center">{{ error }}</p>
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
      isDark: false,
      showAlert: false,
    };
  },
  computed: {
    formattedDate() {
      if (this.weather?.dt) {
        const date = new Date(this.weather.dt * 1000);
        return new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Jakarta'
        }).format(date);
      }
      return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    formattedTime() {
      if (this.weather?.dt) {
        const date = new Date(this.weather.dt * 1000);
        return new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta'
        }).format(date) + ' WIB';
      }
      return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' WIB';
    },
  },
  watch: {
    isDark(newVal) {
      document.documentElement.classList.toggle('dark', newVal);
    }
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
      this.showAlert = false;
      try {
        const apiKey = import.meta.env.VITE_API_KEY || 'YOUR_API_KEY';
        this.weather = await fetchWeather(this.city, apiKey);
        this.forecast = await fetchForecast(this.city, apiKey);
        this.checkWeatherAlert();
      } catch (err) {
        this.error = err.message;
        this.weather = null;
        this.forecast = [];
      } finally {
        this.loading = false;
      }
    },
    checkWeatherAlert() {
      if (this.weather?.weather) {
        const condition = this.weather.weather[0].main.toLowerCase();
        const description = this.weather.weather[0].description.toLowerCase();
        if (condition.includes('rain') && description.includes('heavy') ||
            condition.includes('storm') || condition.includes('thunderstorm')) {
          this.showAlert = true;
        }
      }
    },
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        if (this.city) {
          this.fetchOrRefreshWeather();
        }
      }, 10 * 60 * 1000);
    },
  },
  mounted() {
    this.startAutoRefresh();
    document.documentElement.classList.toggle('dark', this.isDark);
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval);
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

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

.toggle-checkbox {
  display: none;
}
.toggle-slider {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}
.toggle-checkbox:checked + .toggle-slider {
  background-color: #4a90e2;
}
.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}
.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(20px);
}
</style>
