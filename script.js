const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

async function checkWeather(cityName) {
  if (!cityName.trim()) return;

  try {
    // Step 1: Convert city name to latitude & longitude using Open-Meteo Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById('errorMsg').style.display = 'block';
      document.getElementById('weatherDetails').style.display = 'none';
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step 2: Fetch current weather using coordinates (No API key needed!)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Step 3: Update the UI
    document.getElementById('cityName').innerText = name;
    document.getElementById('temp').innerText = Math.round(weatherData.current.temperature_2m) + '°C';
    document.getElementById('humidity').innerText = weatherData.current.relative_humidity_2m + '%';
    document.getElementById('wind').innerText = Math.round(weatherData.current.wind_speed_10m) + ' km/h';

    // Default icon
    document.getElementById('weatherIcon').src = 'https://openweathermap.org/img/wn/02d@2x.png';

    document.getElementById('weatherDetails').style.display = 'block';
    document.getElementById('errorMsg').style.display = 'none';

  } catch (error) {
    console.error('Error fetching weather:', error);
    document.getElementById('errorMsg').style.display = 'block';
  }
}

searchBtn.addEventListener('click', () => checkWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkWeather(cityInput.value);
});