import {Module} from '@nestjs/common';
import {BalanceStampService} from './balance-stamp.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceStamp} from "./balance-stamp.entity";
import { BalanceStampController } from './balance-stamp.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BalanceStamp])],
    providers: [BalanceStampService],
    exports: [BalanceStampService],
    controllers: [BalanceStampController]
})
export class BalanceStampModule {
}
