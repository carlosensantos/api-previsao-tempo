import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as NodeCache from 'node-cache';

@Injectable()
export class WeatherService {
  private apiKey: string;
  private apiUrl: string;
  private cache: NodeCache;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.cache = new NodeCache({ stdTTL: 600 }); // Cache por 10 minutos
  }

  async getWeather(city: string, country: string): Promise<any> {
    if (!city || !country) {
      throw new HttpException('City and country are required', 400);
    }

    const cacheKey = `${city}-${country}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData; // Retorna do cache
    }

    const url = `${this.apiUrl}?q=${city},${country}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await this.httpService.get(url).toPromise();
      this.cache.set(cacheKey, response.data); // Armazena no cache
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new HttpException('City or country not found', 404);
      }
      throw new HttpException('Error fetching weather data', 500);
    }
  }
}
