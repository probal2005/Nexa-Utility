export type WeatherLocation = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
};

export type HourlyWeather = {
  time: string[];
  temperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
};

export type DailyWeather = {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationProbability: number[];
  sunrise: string[];
  sunset: string[];
};

export type WeatherData = {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
};
