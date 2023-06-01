import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletInputDto } from './dtos/create-wallet-input.dto';
import { Wallet } from './wallet.entity';
import { WalletShortInfo } from './dtos/wallet-short-info';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
    constructor(private walletService: WalletService) { }
    @Post()
    async createWallet(@Body() createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        return await this.walletService.createWallet(createWalletInputDto);
    }

    @Get('user-wallets/:userId')
    async getUserWallets(@Param('userId') userId: string): Promise<WalletShortInfo[]> {
        return await this.walletService.getUserWallets(userId);
    }
}
