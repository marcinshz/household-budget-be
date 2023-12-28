import {forwardRef, Module} from '@nestjs/common';
import {WalletController} from './wallet.controller';
import {WalletService} from './wallet.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Wallet} from './wallet.entity';
import {UserModule} from 'src/user/user.module';
import {BalanceStampModule} from "../balance-stamp/balance-stamp.module";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet]), UserModule, forwardRef(() => BalanceStampModule)],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService]
})
export class WalletModule {
}
