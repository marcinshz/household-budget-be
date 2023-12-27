import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Income} from './income.entity';
import {DataSource, MoreThan, Repository} from 'typeorm';
import {WalletService} from 'src/wallet/wallet.service';
import {CategoryService} from 'src/category/category.service';
import {CreateExpenseInputDto} from 'src/expense/dtos/create-expense-input.dto';
import {CreateExpenseDto} from 'src/expense/dtos/create-expense.dto';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private incomeRepository: Repository<Income>,
        private walletService: WalletService,
        private categoryService: CategoryService,
        private dataSource: DataSource
    ) {
    }

    async createIncome(createIncomeInputDto: CreateExpenseInputDto): Promise<Income> {
        const wallet = await this.walletService.getWalletById(createIncomeInputDto.walletId);
        const category = await this.categoryService.getCategoryById(createIncomeInputDto.categoryId);

        if (!wallet) throw new NotFoundException("Wallet not found");
        if (!category) throw new NotFoundException("Category not found");

        const {value, note, walletId} = createIncomeInputDto;

        let parsedValue = typeof value === 'string' ? parseFloat(value) : value;

        const createIncomeDto = new CreateExpenseDto(wallet, category, parsedValue, note);
        const createdIncome = this.incomeRepository.create(createIncomeDto);

        return await this.dataSource.transaction(async () => {
            await this.walletService.updateBalance(walletId, value, true);
            return await this.incomeRepository.save(createdIncome);
        })
    }

    async getIncomesFromPeriod(walletId: string, days: number): Promise<Income[]> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        return await this.incomeRepository.find({
            where: {createdAt: MoreThan(date)},
            relations: {category: true}
        })
    }
}
