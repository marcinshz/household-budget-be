import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { IncomeModule } from 'src/income/income.module';
import { ExpenseModule } from 'src/expense/expense.module';

@Module({
  imports: [IncomeModule, ExpenseModule, IncomeModule],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule { }
