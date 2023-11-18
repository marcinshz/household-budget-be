import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository, UpdateResult} from 'typeorm';
import {Wallet} from './wallet.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateWalletInputDto} from './dtos/create-wallet-input.dto';
import {UserService} from 'src/user/user.service';
import {CreateWalletDto} from './dtos/create-wallet.dto';
import {GetWalletsOverviewInputDto} from "./dtos/get-wallets-overview-input.dto";
import {Income} from "../income/income.entity";
import {Expense} from "../expense/expense.entity";

var _ = require('lodash');

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private userService: UserService
    ) {
    }

    async getWallets(): Promise<Wallet[]> {
        return await this.walletRepository.find({
            relations: ['user', 'incomes', 'incomes.category', 'expenses', 'expenses.category'],
        });
    }

    async getWalletById(walletId: string): Promise<Wallet> {
        const wallet = await this.walletRepository.findOneBy({id: walletId});
        if (!wallet) throw new NotFoundException("Wallet not found");

        return wallet;
    }

    async getUserWallets(userId: string): Promise<Wallet[]> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");

        return await this.walletRepository.find({
            where: {user: {id: user.id}},
            order: {balance: 'DESC'}
        });
    }

    async getUserWalletsExtended(userId: string, period: string): Promise<Wallet[]> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");

        const now = new Date();
        let threshold: Date;

        switch (period) {
            case "Last month":
                threshold = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "Last 3 months":
                threshold = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case "Last 6 months":
                threshold = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                break;
            case "Last year":
                threshold = new Date(now.getFullYear(), 1, 1,);
                break;
            default:
                break;
        }

        let wallets = await this.walletRepository.find({
            relations: ['incomes', 'incomes.category', 'expenses', 'expenses.category'],
            where: {
                user: {id: user.id},
            }
        });

        wallets = wallets.map((wallet) => {
            const filteredIncomes = wallet.incomes.filter(income => {
                const thresholdTime = threshold.getTime();
                const incomeTime = income.createdAt.getTime();
                return incomeTime >= thresholdTime;
            });
            const filteredExpenses = wallet.expenses.filter(expense => {
                const thresholdTime = threshold.getTime();
                const expenseTime = expense.createdAt.getTime();
                return expenseTime >= thresholdTime;
            });

            return {
                ...wallet,
                incomes: filteredIncomes,
                expenses: filteredExpenses
            }
        })

        return wallets;
    }

    getCategorySum(items: Income[] | Expense[]): { name: string, value: number }[] {
        let values: { name: string, value: number }[] = [];

        items.forEach((item) => {
            const index = values.findIndex(value => value.name === item.category.name);
            if (index === -1) {
                values.push({name: item.category.name, value: item.value});
            } else {
                values[index].value += item.value;
            }
        })

        return values;
    }

    getTransactionsGroupedByCategory(items: Income[] | Expense[]) {
        let itemLabels: string[] = [];
        let itemValues: number[] = [];

        items.forEach((item) => {
            const index = itemLabels.findIndex(label => label === item.category.name);
            if (index === -1) {
                itemLabels.push(item.category.name);
                itemValues[itemLabels.length - 1] = item.value;
            } else {
                itemValues[index] += item.value;
            }
        })

        return {
            labels: itemLabels,
            values: itemValues
        };
    }

    getTransactionsGroupedByDate(items: Income[] | Expense[]) {
        let tmp = _.groupBy(items, (item) => new Date(item.createdAt).getFullYear());
        _.forEach(tmp, (value, key) => {
            tmp[key] = _.groupBy((tmp[key]), (item) => new Date(item.createdAt).getMonth() + 1);
        })
        _.forEach(tmp, (value, yearKey) => {
            _.forEach(tmp[yearKey], (value, monthKey) => {
                tmp[yearKey][monthKey] = _.groupBy(tmp[yearKey][monthKey], (item) => new Date(item.createdAt).getDate() + 1);
                _.forEach(tmp[yearKey][monthKey], (value, dayKey) => {
                    tmp[yearKey][monthKey][dayKey] = this.getTransactionsGroupedByCategory(tmp[yearKey][monthKey][dayKey]);
                })
            })
        })
        return tmp;
    }

    async getWalletsOverview(getWalletsOverviewInputDto: GetWalletsOverviewInputDto): Promise<any> {
        const {userId, wallets, period} = getWalletsOverviewInputDto;
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");
        let walletIds = wallets.filter(wallet => wallet.checked).map(wallet => wallet.id);
        const tmp = await this.getUserWalletsExtended(userId, period);

        let incomes = [];
        let expenses = [];

        let categoryIncomeLabels = [];
        let categoryIncomeValues = [];
        let categoryExpenseLabels = [];
        let categoryExpenseValues = [];


        tmp.forEach(wallet => {
            if (walletIds.includes(wallet.id)) {
                incomes = incomes.concat(wallet.incomes);
                expenses = expenses.concat(wallet.expenses);
                let tmp = this.getTransactionsGroupedByCategory(wallet.incomes);
                categoryIncomeLabels = categoryIncomeLabels.concat(tmp.labels);
                categoryIncomeValues = categoryIncomeValues.concat(tmp.values);
                tmp = this.getTransactionsGroupedByCategory(wallet.expenses);
                categoryExpenseLabels = categoryExpenseLabels.concat(tmp.labels);
                categoryExpenseValues = categoryExpenseValues.concat(tmp.values);
            }
        })
        incomes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        expenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const pies = {
            incomes: {
                labels: categoryIncomeLabels,
                datasets: [{data: categoryIncomeValues}]
            },
            expenses: {
                labels: categoryExpenseLabels,
                datasets: [{data: categoryExpenseValues}]
            }
        }

        const incomesGrouped = this.getTransactionsGroupedByDate(incomes);
        const expensesGrouped = this.getTransactionsGroupedByDate(expenses);


        return {
            incomes,
            expenses,
            pies,
            incomesGrouped,
            expensesGrouped
        }
    }

    async createWallet(createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        const user = await this.userService.findUserById(createWalletInputDto.userId);
        if (!user) throw new NotFoundException("User not found");
        const existingWallet = await this.walletRepository.findOneBy({
            name: createWalletInputDto.name,
            user: {id: createWalletInputDto.userId}
        });
        if (existingWallet) throw new Error('User already has a wallet with this name');

        const createWalletDto = new CreateWalletDto(createWalletInputDto.name, createWalletInputDto.balance, user);

        const wallet = this.walletRepository.create(createWalletDto);

        return await this.walletRepository.save(wallet);
    }

    async updateBalance(walletId: string, value: number, positive: boolean): Promise<UpdateResult> {
        let prevBalance = await this.walletRepository.findOneBy({id: walletId}).then(wallet => wallet.balance);
        let newBalance = 0;
        if (positive) newBalance = prevBalance + value;
        else newBalance = prevBalance - value;

        return await this.walletRepository.update({id: walletId}, {balance: newBalance});
    }
}
