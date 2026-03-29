import {
  IsString, IsOptional, IsNumber, IsBoolean, IsEnum,
  IsDateString, IsArray, Min,
} from 'class-validator';
import { BroodPattern, Temperament, ActivityLevel, HealthStatus } from '@prisma/client';

export class CreateInspectionDto {
  @IsString()
  hive_id: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  queen_seen?: boolean;

  @IsOptional()
  @IsEnum(BroodPattern)
  brood_pattern?: BroodPattern;

  @IsOptional()
  @IsEnum(Temperament)
  temperament?: Temperament;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  varroa_count?: number;

  @IsOptional()
  @IsEnum(ActivityLevel)
  activity_level?: ActivityLevel;

  @IsOptional()
  @IsEnum(HealthStatus)
  health_status?: HealthStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diseases?: string[];

  @IsOptional()
  @IsBoolean()
  treatment_applied?: boolean;

  @IsOptional()
  @IsString()
  treatment_product?: string;

  @IsOptional()
  @IsString()
  treatment_dose?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
