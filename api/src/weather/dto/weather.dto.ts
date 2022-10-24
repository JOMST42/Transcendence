import { IsOptional, IsString } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateWeatherDto {
  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  description?: string;
}
