import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Inspections')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class InspectionsController {
  constructor(private inspectionsService: InspectionsService) {}

  @Get('inspections')
  findAll(@Request() req) {
    return this.inspectionsService.findAll(req.user.id);
  }

  @Get('inspections/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.inspectionsService.findOne(id, req.user.id);
  }

  @Get('hives/:hiveId/inspections')
  findByHive(@Param('hiveId') hiveId: string, @Request() req) {
    return this.inspectionsService.findByHive(hiveId, req.user.id);
  }

  @Post('inspections')
  create(@Body() dto: CreateInspectionDto, @Request() req) {
    return this.inspectionsService.create(dto, req.user.id);
  }

  @Put('inspections/:id')
  update(@Param('id') id: string, @Body() dto: UpdateInspectionDto, @Request() req) {
    return this.inspectionsService.update(id, dto, req.user.id);
  }

  @Delete('inspections/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.inspectionsService.remove(id, req.user.id);
  }
}
