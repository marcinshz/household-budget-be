import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {Wallet} from './wallet.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateWalletInputDto} from './dtos/create-wallet-input.dto';
import {UserService} from 'src/user/user.service';
import {CreateWalletDto} from './dtos/create-wallet.dto';
import {GetWalletsOverviewInputDto} from "./dtos/get-wallets-overview-input.dto";
import {Income} from "../income/income.entity";
import {Expense} from "../expense/expense.entity";
import {BalanceStampService} from "../balance-stamp/balance-stamp.service";
import {BalanceStamp} from "../balance-stamp/balance-stamp.entity";
import {CreateCustomDateBalanceStampDto} from "../balance-stamp/dtos/create-custom-date-balance-stamp.dto";
import {differenceInDays} from 'date-fns';

var _ = require('lodash');
var cloneDeep = require('lodash/cloneDeep');

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private userService: UserService,
        private balanceStampService: BalanceStampService
    ) {
    }

    async getWallets(): Promise<Wallet[]> {
        return await this.walletRepository.find({
            relations: ['user', 'incomes', 'incomes.category', 'expenses', 'expenses.category', 'balanceStamps'],
        });
    }

    async getWalletById(walletId: string): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({
            where: {
                id: walletId
            },
            relations: ['balanceStamps']
        });
        if (!wallet) throw new NotFoundException("Wallet not found");

        return wallet;
    }

    async generateLackingBalanceStamps(wallets: Wallet[]) {
        await Promise.all(wallets.map(async (wallet) => {
            let latest: BalanceStamp | null = null;
            wallet.balanceStamps.forEach((stamp: BalanceStamp, index: number) => {
                if (latest) {
                    if (new Date(latest.createdAt) < new Date(stamp.createdAt)) latest = stamp;
                } else latest = stamp;
            })
            if (!latest) return;
            const daysDifference = differenceInDays(new Date(), new Date(latest.createdAt));
            if (daysDifference > 0) {
                for (let i = 1; i <= daysDifference; i++) {
                    const date = new Date(latest.createdAt);
                    date.setDate(date.getDate() + i);
                    const customDateBalanceStamp = new CreateCustomDateBalanceStampDto(latest.balance, wallet, date);
                    await this.balanceStampService.createCustomDateBalanceStamp(customDateBalanceStamp);
                }
            }
        }));
    }

    async getUserWallets(userId: string): Promise<Wallet[]> {
        const wallets = await this.walletRepository.find({
            relations: ['balanceStamps'],
            where: {user: {id: userId}}
        });

        await this.generateLackingBalanceStamps(wallets);

        return await this.walletRepository.find({
            relations: ['balanceStamps'],
            where: {user: {id: userId}}
        });
    }

    async getUserWalletsExtended(userId: string): Promise<Wallet[]> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");

        return await this.walletRepository.find({
            relations: ['incomes', 'incomes.category', 'expenses', 'expenses.category'],
            where: {
                user: {id: user.id},
            }
        });
    }

    getCategorySum(items: Income[] | Expense[]): {
        name: string,
        value: number
    }[] {
        let values: {
            name: string,
            value: number
        }[] = [];

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

    getTransactionsGroupedByDateTest(items: Income[] | Expense[]) {
        let tmp = _.groupBy(items, (item) => new Date(item.createdAt).getFullYear());
        let copyYearly = cloneDeep(tmp);
        _.forEach(tmp, (value, key) => {
            copyYearly[key] = this.getTransactionsGroupedByCategory(tmp[key]);
            tmp[key] = _.groupBy((tmp[key]), (item) => new Date(item.createdAt).getMonth() + 1);
        })
        let copyMonthly = cloneDeep(tmp);
        _.forEach(tmp, (value, yearKey) => {
            _.forEach(tmp[yearKey], (value, monthKey) => {
                copyMonthly[yearKey][monthKey] = this.getTransactionsGroupedByCategory(tmp[yearKey][monthKey]);
                tmp[yearKey][monthKey] = _.groupBy(tmp[yearKey][monthKey], (item) => new Date(item.createdAt).getDate());
            })
        })
        let copyDaily = cloneDeep(tmp);
        _.forEach(tmp, (value, yearKey) => {
            _.forEach(tmp[yearKey], (value, monthKey) => {
                _.forEach(tmp[yearKey][monthKey], (value, dayKey) => {
                    copyDaily[yearKey][monthKey][dayKey] = this.getTransactionsGroupedByCategory(tmp[yearKey][monthKey][dayKey]);
                })
            })
        })

        const mergedObject = {};

        Object.keys(copyYearly).forEach(year => {
            mergedObject[year] = {
                overview: {...copyYearly[year]},
                months: {}
            };

            if (copyMonthly[year]) {
                Object.keys(copyMonthly[year]).forEach(month => {
                    mergedObject[year].months[month] = {
                        overview: {...copyMonthly[year][month]},
                        days: {}
                    };

                    if (copyDaily[year] && copyDaily[year][month]) {
                        Object.keys(copyDaily[year][month]).forEach(day => {
                            mergedObject[year].months[month].days[day] = {
                                overview: {...copyDaily[year][month][day]},
                                list: tmp[year][month][day]
                            };
                        });
                    }
                });
            }
        });


        return mergedObject;
    }

    async getWalletsOverviewTest(getWalletsOverviewInputDto: GetWalletsOverviewInputDto): Promise<any> {
        const {userId, wallets} = getWalletsOverviewInputDto;
        let walletIds = wallets.filter(wallet => wallet.checked).map(wallet => wallet.id);
        const tmp = await this.getUserWalletsExtended(userId);

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
        incomes = incomes.filter((income, index) => {
            return income.category.name !== 'Internal Transfer';
        })
        expenses = expenses.filter((expense, index) => {
            return expense.category.name !== 'Internal Transfer';
        })

        const incomesGrouped = this.getTransactionsGroupedByDateTest(incomes);
        const expensesGrouped = this.getTransactionsGroupedByDateTest(expenses);

        return {
            incomes,
            expenses,
            incomesGrouped,
            expensesGrouped
        }
    }

    async getWalletsOverview(getWalletsOverviewInputDto: GetWalletsOverviewInputDto): Promise<any> {
        const {userId, wallets} = getWalletsOverviewInputDto;
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");
        let walletIds = wallets.filter(wallet => wallet.checked).map(wallet => wallet.id);
        const tmp = await this.getUserWalletsExtended(userId);

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

        const createWalletDto = new CreateWalletDto(createWalletInputDto.name, createWalletInputDto.balance, user, createWalletInputDto.savingsWallet);

        let wallet = this.walletRepository.create(createWalletDto);
        wallet = await this.walletRepository.save(wallet);
        await this.balanceStampService.createBalanceStamp(wallet, createWalletInputDto.balance);

        return this.getWalletById(wallet.id);
    }

    async removeWallet(walletId: string): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({
            where: {id: walletId},
            relations: ['incomes', 'expenses', 'balanceStamps']
        });
        return await this.walletRepository.remove(wallet)
    }

    async updateBalance(walletId: string, value: number, positive: boolean) {
        let wallet = await this.walletRepository.findOne({
            relations: ['balanceStamps'],
            where: {
                id: walletId
            }
        });
        const parsedValue = typeof value === "string" ? parseFloat(value) : value;
        let currentBalance: number = typeof wallet.balanceStamps[0].balance === "string" ? parseFloat(wallet.balanceStamps[0].balance) : wallet.balanceStamps[0].balance;
        let newBalance = 0;
        if (positive) newBalance = currentBalance + parsedValue;
        else newBalance = currentBalance - parsedValue;
        return await this.balanceStampService.createBalanceStamp(wallet, newBalance);
    }
}
