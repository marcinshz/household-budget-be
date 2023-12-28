import {forwardRef, Module} from '@nestjs/common';
import {BalanceStampService} from './balance-stamp.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceStamp} from "./balance-stamp.entity";
import {BalanceStampController} from './balance-stamp.controller';
import {GoalModule} from "../goal/goal.module";

@Module({
    imports: [TypeOrmModule.forFeature([BalanceStamp]), forwardRef(() => GoalModule)],
    providers: [BalanceStampService],
    exports: [BalanceStampService],
    controllers: [BalanceStampController]
})
export class BalanceStampModule {
}
