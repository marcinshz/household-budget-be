import { Expense } from "src/expense/expense.entity";
import { Income } from "src/income/income.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    balance:number;

    @OneToMany(() => Expense, expense => expense.wallet)
    expenses: Expense[]

    @OneToMany(() => Income, income => income.wallet)
    incomes: Income[]

    @ManyToOne(() => User, user => user.wallets)
    user: User;
}