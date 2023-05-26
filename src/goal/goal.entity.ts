import { Wallet } from "src/wallet/wallet.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    start: Date;

    @Column()
    deadline: Date;

    @Column()
    value: number;

    @Column()
    note: string;

    @OneToOne(() => Wallet)
    @JoinColumn()
    wallet: Wallet;
}
