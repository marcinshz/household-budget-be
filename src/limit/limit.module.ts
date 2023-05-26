import { Module } from '@nestjs/common';
import { LimitController } from './limit.controller';
import { LimitService } from './limit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Limit } from './limit.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports:[TypeOrmModule.forFeature([Limit]), CategoryModule],
  controllers: [LimitController],
  providers: [LimitService]
})
export class LimitModule {}
