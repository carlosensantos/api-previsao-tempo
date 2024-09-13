import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query('city') city: string,
    @Query('country') country: string,
  ) {
    return this.weatherService.getWeather(city, country);
  }

  @Get('forecast')
  async get5DayForecast(
    @Query('city') city: string,
    @Query('country') country: string,
  ) {
    return this.weatherService.get5DayForecast(city, country);
  }
}
