import {forwardRef, Module} from '@nestjs/common';
import {GoalController} from './goal.controller';
import {GoalService} from './goal.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Goal} from './goal.entity';
import {UserModule} from "../user/user.module";
import {WalletModule} from "../wallet/wallet.module";

@Module({
    imports: [TypeOrmModule.forFeature([Goal]), forwardRef(() => WalletModule), UserModule],
    controllers: [GoalController],
    providers: [GoalService],
    exports: [GoalService]
})
export class GoalModule {
}
