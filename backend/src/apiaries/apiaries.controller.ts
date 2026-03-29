import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiariesService } from './apiaries.service';
import { CreateApiaryDto } from './dto/create-apiary.dto';
import { UpdateApiaryDto } from './dto/update-apiary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Apiaries')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/apiaries')
export class ApiariesController {
  constructor(private apiariesService: ApiariesService) {}

  @Get()
  findAll(@Request() req) {
    return this.apiariesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.apiariesService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateApiaryDto, @Request() req) {
    return this.apiariesService.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApiaryDto, @Request() req) {
    return this.apiariesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.apiariesService.remove(id, req.user.id);
  }

  @Get(':id/hives')
  findHives(@Param('id') id: string, @Request() req) {
    return this.apiariesService.findHives(id, req.user.id);
  }
}
