import {Injectable} from '@nestjs/common';
import {CreateTransactionDto} from './dtos/create-transaction.dto';
import {IncomeService} from 'src/income/income.service';
import {ExpenseService} from 'src/expense/expense.service';
import {DataSource} from 'typeorm';
import {CreateExpenseInputDto} from 'src/expense/dtos/create-expense-input.dto';

@Injectable()
export class TransactionService {
    constructor(
        private incomeService: IncomeService,
        private expenseService: ExpenseService,
        private dataSource: DataSource
    ) {
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const {senderWalletId, senderCategoryId, receiverCategoryId, receiverWalletId, value} = createTransactionDto;

        const expense = new CreateExpenseInputDto(senderCategoryId, value, "", senderWalletId);
        const income = new CreateExpenseInputDto(receiverCategoryId, value, "", receiverWalletId);
        return await this.dataSource.transaction(async () => {
            await this.incomeService.createIncome(income)
            await this.expenseService.createExpense(expense);
        })
    }
}
