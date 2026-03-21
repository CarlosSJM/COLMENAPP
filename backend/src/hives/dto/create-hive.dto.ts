import {
  IsString, IsOptional, IsNumber, IsEnum, IsDateString, MinLength, Min,
} from 'class-validator';
import { HiveStatus, QueenOrigin } from '@prisma/client';

export class CreateHiveDto {
  @IsString()
  @MinLength(1)
  code: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  apiary_id: string;

  @IsOptional()
  @IsEnum(HiveStatus)
  status?: HiveStatus;

  @IsOptional()
  @IsEnum(QueenOrigin)
  queen_origin?: QueenOrigin;

  @IsOptional()
  @IsNumber()
  @Min(0)
  population?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  frames?: number;

  @IsOptional()
  @IsDateString()
  installed_at?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
