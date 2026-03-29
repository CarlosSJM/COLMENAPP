import { Module } from '@nestjs/common';
import { HivesService } from './hives.service';
import { HivesController } from './hives.controller';

@Module({
  controllers: [HivesController],
  providers: [HivesService],
  exports: [HivesService],
})
export class HivesModule {}
