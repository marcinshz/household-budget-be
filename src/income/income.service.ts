import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { Repository } from 'typeorm';
import { WalletService } from 'src/wallet/wallet.service';
import { CategoryService } from 'src/category/category.service';
import { CreateExpenseInputDto } from 'src/expense/dtos/create-expense-input.dto';
import { CreateExpenseDto } from 'src/expense/dtos/create-expense.dto';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private incomeRepository: Repository<Income>,
        private walletService: WalletService,
        private categoryService: CategoryService
    ) { }

    async createIncome(createIncomeInputDto: CreateExpenseInputDto): Promise<Income> {
        const wallet = await this.walletService.findWalletById(createIncomeInputDto.walletId);
        const category = await this.categoryService.getCategoryById(createIncomeInputDto.categoryId);

        if (!wallet) throw new NotFoundException("Wallet not found");
        if (!category) throw new NotFoundException("Category not found");

        const { value, note } = createIncomeInputDto;

        const createIncomeDto = new CreateExpenseDto(wallet, category, value, note);

        const createdIncome = await this.incomeRepository.create(createIncomeDto);

        return await this.incomeRepository.save(createdIncome);
    }
}
