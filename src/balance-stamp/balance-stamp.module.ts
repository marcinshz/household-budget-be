import {Module} from '@nestjs/common';
import {BalanceStampService} from './balance-stamp.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceStamp} from "./balance-stamp.entity";

@Module({
    imports: [TypeOrmModule.forFeature([BalanceStamp])],
    providers: [BalanceStampService],
    exports: [BalanceStampService]
})
export class BalanceStampModule {
}
