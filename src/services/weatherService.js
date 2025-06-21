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

export async function fetchForecast(city, apiKey) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`
    );
    if (!response.ok) {
      throw new Error('Data prakiraan tidak ditemukan!');
    }
    const data = await response.json();
    // Ambil 5 hari pertama (1 data per hari, ambil jam 12:00)
    return data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
  } catch (error) {
    throw error;
  }
}