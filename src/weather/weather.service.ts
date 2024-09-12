import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


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
    const url = `${this.apiUrl}?q=${city},${country}&appid=${this.apiKey}&units=metric`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }
}