import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class WeatherService {
  private apiKey: string;
  private apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeather(city: string, country: string): Promise<any> {
    if (!city || !country) {
      throw new HttpException('City and country are required', 400);
    }

    const url = `${this.apiUrl}?q=${city},${country}&appid=${this.apiKey}&units=metric`;
    
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new HttpException('City or country not found', 404);
      }
      throw new HttpException('Error fetching weather data', 500);
    }
  }
}
