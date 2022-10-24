import { ForbiddenException, Injectable } from '@nestjs/common';
import { Weather } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateWeatherDto, UpdateWeatherDto } from './dto';

@Injectable()
export class WeatherService {
  constructor(private readonly prisma: PrismaService) {}

  getWeather(): Promise<Weather[]> {
    return this.prisma.weather.findMany();
  }

  getWeatherById(id: number): Promise<Weather | null> {
    return this.prisma.weather.findUnique({
      where: {
        id,
      },
    });
  }

  createWeather(dto: CreateWeatherDto): Promise<Weather> {
    return this.prisma.weather.create({
      data: dto,
    });
  }

  deleteWeather(id: number): Promise<Weather> {
    return this.prisma.weather.delete({
      where: {
        id,
      },
    });
  }

  updateWeather(id: number, dto: UpdateWeatherDto): Promise<Weather> {
    const weather = this.prisma.weather.findUnique({
      where: {
        id,
      },
    });

    if (!weather) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.weather.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
}
