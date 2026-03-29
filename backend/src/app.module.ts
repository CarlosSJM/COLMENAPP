import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiariesModule } from './apiaries/apiaries.module';
import { HivesModule } from './hives/hives.module';
import { InspectionsModule } from './inspections/inspections.module';
import { ProductionModule } from './production/production.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ApiariesModule,
    HivesModule,
    InspectionsModule,
    ProductionModule,
    TasksModule,
    DashboardModule,
  ],
})
export class AppModule {}
