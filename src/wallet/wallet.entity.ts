import { Expense } from "src/expense/expense.entity";
import { Income } from "src/income/income.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Expense, expense => expense.wallet)
    expenses: Expense

    @OneToMany(() => Income, income => income.wallet)
    incomes: Income
}