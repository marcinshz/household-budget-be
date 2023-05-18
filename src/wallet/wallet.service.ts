import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWalletInputDto } from './dtos/create-wallet-input.dto';
import { UserService } from 'src/user/user.service';
import { CreateWalletDto } from './dtos/create-wallet.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        private userService: UserService
    ) { }

    async getWallet(name: string): Promise<Wallet> {
        return await this.walletRepository.findOneBy({ name });
    }

    async createWallet(createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        const existingWallet = await this.getWallet(createWalletInputDto.name);
        if (existingWallet) throw new Error('Wallet name taken')
        const user = await this.userService.findUserById(createWalletInputDto.userId);
        if (!user) throw new NotFoundException("User not found");

        const createWalletDto = new CreateWalletDto(createWalletInputDto.name, user);

        const wallet = await this.walletRepository.create(createWalletDto);

        return await this.walletRepository.save(wallet);
    }
}
