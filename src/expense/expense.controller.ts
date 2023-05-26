import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { CreateExpenseInputDto } from './dtos/create-expense-input.dto';

@Controller('expense')
@ApiTags('expense')
export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    @Post()
    async createExpense(@Body() createExpenseInputDto: CreateExpenseInputDto): Promise<Expense> {
        return await this.expenseService.createExpense(createExpenseInputDto);
    }
}
