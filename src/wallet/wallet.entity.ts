import {Expense} from "src/expense/expense.entity";
import {Income} from "src/income/income.entity";
import {User} from "src/user/user.entity";
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BalanceStamp} from "../balance-stamp/balance-stamp.entity";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Expense, expense => expense.wallet)
    expenses: Expense[]

    @OneToMany(() => Income, income => income.wallet)
    incomes: Income[]

    @OneToMany(() => BalanceStamp, balanceStamp => balanceStamp.wallet)
    balanceStamps: BalanceStamp[]

    @ManyToOne(() => User, user => user.wallets)
    user: User;

    @CreateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date;
}