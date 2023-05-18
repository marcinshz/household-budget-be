import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpenseService } from './expense.service';

@Controller('expense')
@ApiTags('expense')
export class ExpenseController {
    constructor(private expenseService: ExpenseService){}
    
}
