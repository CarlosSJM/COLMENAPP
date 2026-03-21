import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateProductionDto {
  @IsString()
  hive_id: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  honey_kg: number;

  @IsNumber()
  @Min(0)
  wax_kg: number;

  @IsNumber()
  @Min(0)
  propolis_g: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
