import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletInputDto } from './dtos/create-wallet-input.dto';
import { Wallet } from './wallet.entity';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
    constructor(private walletService: WalletService) { }
    @Post()
    async createWallet(@Body() createWalletInputDto: CreateWalletInputDto): Promise<Wallet> {
        return await this.walletService.createWallet(createWalletInputDto);
    }
}
