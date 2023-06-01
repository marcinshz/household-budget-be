import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWalletInputDto } from './dtos/create-wallet-input.dto';
import { UserService } from 'src/user/user.service';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { Expense } from 'src/expense/expense.entity';
import { Income } from 'src/income/income.entity';
import { WalletCompleteInfoDto } from './dtos/wallet-complete-info.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private userService: UserService
    ) { }

    async findWallet(name: string): Promise<Wallet> {
        return await this.walletRepository.findOneBy({ name });
    }

    async findWalletById(id: string): Promise<Wallet> {
        return await this.walletRepository.findOneBy({ id });
    }

    async createWallet(createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        const existingWallet = await this.findWallet(createWalletInputDto.name);
        if (existingWallet) throw new Error('Wallet name taken')
        const user = await this.userService.findUserById(createWalletInputDto.userId);
        if (!user) throw new NotFoundException("User not found");

        const createWalletDto = new CreateWalletDto(createWalletInputDto.name, user);

        const wallet = await this.walletRepository.create(createWalletDto);

        return await this.walletRepository.save(wallet);
    }

    async getUserWallets(userId: string): Promise<WalletCompleteInfoDto[]> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new NotFoundException("User not found");

        const wallets = await this.walletRepository.find({
            relations: { incomes: true, expenses: true },
            where: { user }
        })

        const walletsCompleteInfoDto = wallets.map((wallet: Wallet) => {
            const { id, name, incomes, expenses } = wallet;
            let value = 0;

            wallet.incomes.forEach((income: Income) => {
                value += income.value;
            })
            wallet.expenses.forEach((expense: Expense) => {
                value -= expense.value;
            })
            return new WalletCompleteInfoDto(id, name, value, incomes, expenses);
        })

        return walletsCompleteInfoDto;
    }
}
