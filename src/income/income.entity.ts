import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "src/wallet/wallet.entity";
import { IncomeCategory } from "./income.types";

@Entity()
export class Income {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: IncomeCategory;

    @Column()
    value: number;

    @Column()
    note: string;

    @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @ManyToOne(() => Wallet, wallet => wallet.incomes)
    wallet: Wallet;
}