import { Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), WalletModule],
  controllers: [GoalController],
  providers: [GoalService]
})
export class GoalModule { }
