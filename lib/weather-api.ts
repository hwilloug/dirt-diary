import axios from 'axios';

const OPENWEATHER_API_KEY = ''; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/3.0';
const BASE_GEO_URL = 'http://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  uvi: number;
  wind_speed: number;
  description: string;
  icon: string;
  alerts?: WeatherAlert[];
}

export interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
}

export interface Location {
  lat: number;
  lon: number;
  name: string;
  zipCode: string;
}

export async function getLocationByZip(zipCode: string): Promise<Location> {
  try {
    const response = await axios.get(
      `${BASE_GEO_URL}/zip?zip=${zipCode},{country code}&appid=${OPENWEATHER_API_KEY}`
    );
    return {
      lat: response.data.lat,
      lon: response.data.lon,
      name: response.data.name,
      zipCode,
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    throw new Error('Invalid zip code');
  }
}

export async function getWeatherData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  try {
    const response = await axios.get(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${OPENWEATHER_API_KEY}`
    );

    const current = response.data.current;
    const alerts = response.data.alerts;

    return {
      temp: current.temp,
      feels_like: current.feels_like,
      humidity: current.humidity,
      uvi: current.uvi,
      wind_speed: current.wind_speed,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      alerts,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

export function getWeatherWarnings(data: WeatherData): string[] {
  const warnings: string[] = [];

  // Temperature warnings
  if (data.temp <= 32) {
    warnings.push(
      'Frost warning! Protect sensitive plants from freezing temperatures.'
    );
  } else if (data.temp >= 90) {
    warnings.push(
      'Heat warning! Ensure plants are well-watered and provide shade if needed.'
    );
  }

  // UV warnings
  if (data.uvi >= 6) {
    warnings.push(
      'High UV levels! Consider providing shade for sensitive plants.'
    );
  }

  // Wind warnings
  if (data.wind_speed >= 20) {
    warnings.push('Strong winds! Secure or protect plants from wind damage.');
  }

  // Humidity warnings
  if (data.humidity <= 30) {
    warnings.push(
      'Low humidity! Consider misting plants or using a humidity tray.'
    );
  } else if (data.humidity >= 80) {
    warnings.push(
      'High humidity! Monitor for fungal diseases and ensure good air circulation.'
    );
  }

  // Add any active weather alerts
  if (data.alerts) {
    data.alerts.forEach((alert) => {
      warnings.push(`Weather Alert: ${alert.event} - ${alert.description}`);
    });
  }

  return warnings;
}
