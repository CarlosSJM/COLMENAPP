import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HivesService } from './hives.service';
import { CreateHiveDto } from './dto/create-hive.dto';
import { UpdateHiveDto } from './dto/update-hive.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hives')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/hives')
export class HivesController {
  constructor(private hivesService: HivesService) {}

  @Get()
  findAll(@Request() req) {
    return this.hivesService.findAll(req.user.id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string, @Request() req) {
    return this.hivesService.findByCode(code, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.hivesService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateHiveDto, @Request() req) {
    return this.hivesService.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHiveDto, @Request() req) {
    return this.hivesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.hivesService.remove(id, req.user.id);
  }
}
