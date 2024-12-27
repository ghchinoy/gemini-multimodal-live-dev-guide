const OPENWEATHER_API_KEY = '<YOUR_API_KEY>'; // Replace with actual key

export async function getWeather(city) {
  try {
    // First get coordinates for the city
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    console.log('Fetching geo data from:', geoUrl);
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error(`Geo API failed with status: ${geoResponse.status}`);
    }
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      return {
        error: `Could not find location: ${city}`
      };
    }

    const { lat, lon } = geoData[0];

    // Then get weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    console.log('Fetching weather data from:', weatherUrl);
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather API failed with status: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();

    return {
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      city: weatherData.name,
      country: weatherData.sys.country
    };
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      type: error.name
    });
    return {
      error: `Error fetching weather for ${city}: ${error.message}`
    };
  }
} 
