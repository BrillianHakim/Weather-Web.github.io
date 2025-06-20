export async function fetchWeather(city, apiKey) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`
    );
    if (!response.ok) {
      throw new Error('Kota tidak ditemukan!');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}