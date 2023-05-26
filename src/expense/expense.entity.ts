import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "src/wallet/wallet.entity";
import { Category } from "src/category/category.entity";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Category)
    @JoinColumn()
    category: Category;

    @Column()
    value: number;

    @Column()
    note: string;

    @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @ManyToOne(() => Wallet, wallet => wallet.expenses)
    wallet: Wallet;
}