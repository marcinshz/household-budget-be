import { Injectable, NotFoundException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletService } from 'src/wallet/wallet.service';
import { CategoryService } from 'src/category/category.service';
import { CreateExpenseInputDto } from './dtos/create-expense-input.dto';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { Wallet } from 'src/wallet/wallet.entity';

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
        private walletService: WalletService,
        private categoryService: CategoryService
    ) { }

    async createExpense(createExpenseInputDto: CreateExpenseInputDto): Promise<Expense> {
        const wallet = await this.walletService.findWalletById(createExpenseInputDto.walletId);
        const category = await this.categoryService.getCategoryById(createExpenseInputDto.categoryId);

        if (!wallet) throw new NotFoundException("Wallet not found");
        if (!category) throw new NotFoundException("Category not found");

        const { value, note } = createExpenseInputDto;

        const createExpenseDto = new CreateExpenseDto(wallet, category, value, note);

        const createdExpense = await this.expenseRepository.create(createExpenseDto);

        return await this.expenseRepository.save(createdExpense);
    }

    async getExpenses(wallet: Wallet): Promise<Expense[]> {
        return await this.expenseRepository.findBy({ wallet });
    }

    async getExpensessFromPeriod(walletId: string, days: number): Promise<Expense[]> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        return await this.expenseRepository.findBy({
            createdAt: MoreThan(date)
        })
    }
}
