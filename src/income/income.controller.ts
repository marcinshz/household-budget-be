import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IncomeService } from './income.service';
import { Income } from './income.entity';
import { CreateExpenseInputDto } from 'src/expense/dtos/create-expense-input.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('income')
@ApiTags('income')
export class IncomeController {
    constructor(private incomeService: IncomeService) { }

    @Post()
    async createIncome(@Body() createIncomeInputDto: CreateExpenseInputDto): Promise<Income> {
        return await this.incomeService.createIncome(createIncomeInputDto);
    }

    @Get('/:walletId/:days')
    async getIncomesFromPeriod(@Param('walletId') walletId: string, @Param('days') days: number): Promise<Income[]> {
        return await this.incomeService.getIncomesFromPeriod(walletId,days);
    }
}
