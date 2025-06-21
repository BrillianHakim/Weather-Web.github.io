<template>
  <div class="text-center text-gray-900 dark:text-white">
    <h2 class="text-xl font-semibold mb-1">{{ weather.name }}</h2>
    <p class="text-4xl font-bold mb-1">{{ Math.round(weather.main.temp) }}°C</p>
    <p class="capitalize mb-2 text-gray-700 dark:text-gray-300">{{ weather.weather[0].description }}</p>
    <img
      :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
      alt="Weather Icon"
      class="mx-auto mb-2"
    />
    <p class="text-sm">Kelembapan: {{ weather.main.humidity }}%</p>
    <p class="text-sm">Angin: {{ weather.wind.speed }} m/s</p>
  </div>
</template>

<script>
export default {
  props: {
    weather: {
      type: Object,
      required: true,
    },
  },
};
</script>
