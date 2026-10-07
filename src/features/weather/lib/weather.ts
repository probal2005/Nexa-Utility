import type {
  WeatherData,
  WeatherLocation,
} from "@/features/weather/types";

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

export function getWeatherDescription(
  code: number,
): string {
  if (code === 0) {
    return "Clear sky";
  }

  if ([1, 2, 3].includes(code)) {
    return "Partly cloudy";
  }

  if ([45, 48].includes(code)) {
    return "Foggy";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([85, 86].includes(code)) {
    return "Snow showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Unknown";
}

export function getWeatherIcon(code: number): string {
  if (code === 0) {
    return "☀️";
  }

  if ([1, 2].includes(code)) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "🌦️";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "🌨️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "🌡️";
}

export function formatForecastDay(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(parsed);
}

export function formatHour(date: string): string {
  const parsed = new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
  }).format(parsed);
}

export async function searchLocations(
  query: string,
): Promise<WeatherLocation[]> {
  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(
      query,
    )}&count=8&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error("Unable to search locations.");
  }

  const data = await response.json();

  return (data.results ?? []).map(
    (location: {
      name: string;
      country: string;
      admin1?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }) => ({
      name: location.name,
      country: location.country,
      admin1: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    }),
  );
}

export async function fetchWeather(
  location: WeatherLocation,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day",
    hourly:
      "temperature_2m,precipitation_probability,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(
    `${WEATHER_URL}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load weather data.");
  }

  const data = await response.json();

  return {
    location,
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature:
        data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      precipitationProbability:
        data.hourly.precipitation_probability,
      weatherCode: data.hourly.weather_code,
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      precipitationProbability:
        data.daily.precipitation_probability_max,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
    },
  };
}
