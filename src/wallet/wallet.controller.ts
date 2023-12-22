import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {WalletService} from './wallet.service';
import {CreateWalletInputDto} from './dtos/create-wallet-input.dto';
import {Wallet} from './wallet.entity';
import {GetWalletsOverviewInputDto} from "./dtos/get-wallets-overview-input.dto";

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
    constructor(private walletService: WalletService) {
    }

    @Post()
    async createWallet(@Body() createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        return await this.walletService.createWallet(createWalletInputDto);
    }

    @Delete(':walletId')
    async removeWallet(@Param('walletId') walletId: string): Promise<Wallet> {
        return await this.walletService.removeWallet(walletId);
    }

    @Get()
    async getWallets(): Promise<Wallet[]> {
        return await this.walletService.getWallets();
    }

    @Get('user-wallets/:userId')
    async getUserWallets(@Param('userId') userId: string): Promise<Wallet[]> {
        return await this.walletService.getUserWallets(userId);
    }

    @Post('user-wallets-overview')
    async getWalletsOverview(@Body() getWalletsOverviewInputDto: GetWalletsOverviewInputDto): Promise<any> {
        return await this.walletService.getWalletsOverview(getWalletsOverviewInputDto);
    }

    @Post('user-wallets-overview-test')
    async getWalletsOverviewTest(@Body() getWalletsOverviewInputDto: GetWalletsOverviewInputDto): Promise<any> {
        return await this.walletService.getWalletsOverviewTest(getWalletsOverviewInputDto);
    }
}
