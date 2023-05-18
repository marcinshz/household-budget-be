import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { ExpenseModule } from 'src/expense/expense.module';
import { IncomeModule } from 'src/income/income.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Wallet]), ExpenseModule, IncomeModule, UserModule],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
