import {Injectable, NotFoundException} from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
import {Expense} from './expense.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {WalletService} from 'src/wallet/wallet.service';
import {CategoryService} from 'src/category/category.service';
import {CreateExpenseInputDto} from './dtos/create-expense-input.dto';
import {CreateExpenseDto} from './dtos/create-expense.dto';
import {Wallet} from 'src/wallet/wallet.entity';
import {UserService} from 'src/user/user.service';
import {Limit} from "../limit/limit.entity";

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
        private walletService: WalletService,
        private categoryService: CategoryService,
        private userService: UserService,
        private dataSource: DataSource
    ) {
    }

    async createExpense(createExpenseInputDto: CreateExpenseInputDto): Promise<Expense> {
        const wallet = await this.walletService.getWalletById(createExpenseInputDto.walletId);
        const category = await this.categoryService.getCategoryById(createExpenseInputDto.categoryId);

        if (!wallet) throw new NotFoundException("Wallet not found");
        if (!category) throw new NotFoundException("Category not found");

        const {value, note, walletId} = createExpenseInputDto;

        const createExpenseDto = new CreateExpenseDto(wallet, category, value, note);

        const createdExpense = this.expenseRepository.create(createExpenseDto);

        return await this.dataSource.transaction(async () => {
            await this.walletService.updateBalance(walletId, value, false);
            return await this.expenseRepository.save(createdExpense);
        })
    }

    async getExpenses(wallet: Wallet): Promise<Expense[]> {
        return await this.expenseRepository.findBy({wallet});
    }

    //git jest ale nie lapie zakresu dat
    async getUserExpensessFromPeriod(userId: string, days: number) {
        const user = await this.userService.findUserById(userId);
        let expenses: Expense[] = [];
        user.wallets.forEach(wallet => {
            const expenses_tmp = wallet.expenses.filter((expense: Expense) => {
                let date = new Date();
                if (date.getDate() - days <= expense.createdAt.getDate()) return true;
                return false;
            })
            expenses.concat(expenses_tmp)
        });
        return expenses;
    }

    async getCategoryExpensesPeriod(limit: Limit): Promise<Expense[]> {
        return await this.expenseRepository
            .createQueryBuilder('expense')
            .where('expense.createdAt BETWEEN :startDate AND :endDate', {
                startDate: limit.start,
                endDate: limit.deadline
            })
            .andWhere('expense.category.id = :categoryId', {categoryId: limit.category.id})
            .getMany();
    }


}
