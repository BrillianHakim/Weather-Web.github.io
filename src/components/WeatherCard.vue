<template>
  <div class="text-center">
    <h2 class="text-xl font-semibold">{{ weather.name }}</h2>
    <p class="text-4xl font-bold">{{ Math.round(weather.main.temp) }}°C</p>
    <p class="capitalize">{{ weather.weather[0].description }}</p>
    <img
      :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`"
      alt="Weather Icon"
      class="mx-auto"
    />
    <p>Kelembapan: {{ weather.main.humidity }}%</p>
    <p>Angin: {{ weather.wind.speed }} m/s</p>
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