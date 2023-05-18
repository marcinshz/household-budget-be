import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExpenseCategory } from "./expense.types";
import { Wallet } from "src/wallet/wallet.entity";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: ExpenseCategory;

    @Column()
    value: number;

    @Column()
    note: string;

    @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @ManyToOne(() => Wallet, wallet => wallet.expenses)
    wallet: Wallet;
}