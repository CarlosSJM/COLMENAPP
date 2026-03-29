import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Production')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get('productions')
  findAll(@Request() req) {
    return this.productionService.findAll(req.user.id);
  }

  @Get('productions/stats')
  stats(@Request() req) {
    return this.productionService.stats(req.user.id);
  }

  @Get('productions/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.productionService.findOne(id, req.user.id);
  }

  @Get('hives/:hiveId/productions')
  findByHive(@Param('hiveId') hiveId: string, @Request() req) {
    return this.productionService.findByHive(hiveId, req.user.id);
  }

  @Post('productions')
  create(@Body() dto: CreateProductionDto, @Request() req) {
    return this.productionService.create(dto, req.user.id);
  }

  @Put('productions/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductionDto, @Request() req) {
    return this.productionService.update(id, dto, req.user.id);
  }

  @Delete('productions/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productionService.remove(id, req.user.id);
  }
}
