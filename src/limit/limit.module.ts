import {Module} from '@nestjs/common';
import {LimitController} from './limit.controller';
import {LimitService} from './limit.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Limit} from './limit.entity';
import {CategoryModule} from 'src/category/category.module';
import {UserModule} from "../user/user.module";
import {ExpenseModule} from "../expense/expense.module";

@Module({
    imports: [TypeOrmModule.forFeature([Limit]), CategoryModule, UserModule, ExpenseModule],
    controllers: [LimitController],
    providers: [LimitService]
})
export class LimitModule {
}
