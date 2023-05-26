import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletService } from 'src/wallet/wallet.service';
import { CategoryService } from 'src/category/category.service';
import { CreateExpenseInputDto } from './dtos/create-expense-input.dto';
import { CreateExpenseDto } from './dtos/create-expense.dto';

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
}
