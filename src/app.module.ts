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
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port: 5432,
      username:'postgres',
      password:'admin',
      database:'household-budget',
      entities:[User],
      synchronize:true,
      autoLoadEntities:true
    }),
    UserModule,
    AuthModule,
    ExpenseModule,
    WalletModule,
    IncomeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
