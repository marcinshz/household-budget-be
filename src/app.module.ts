import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { WalletModule } from './wallet/wallet.module';
import { IncomeModule } from './income/income.module';
import { CategoryModule } from './category/category.module';
import { Wallet } from './wallet/wallet.entity';
import { Expense } from './expense/expense.entity';
import { Income } from './income/income.entity';
import { Category } from './category/category.entity';
import { TransactionModule } from './transaction/transaction.module';
import { GoalModule } from './goal/goal.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'household-budget',
      entities: [User, Wallet, Expense, Income, Category],
      synchronize: true,
      autoLoadEntities: true
    }),
    UserModule,
    AuthModule,
    ExpenseModule,
    WalletModule,
    IncomeModule,
    CategoryModule,
    TransactionModule,
    GoalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
