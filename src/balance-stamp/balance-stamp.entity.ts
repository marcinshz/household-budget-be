import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Wallet} from "../wallet/wallet.entity";

@Entity()
export class BalanceStamp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Wallet, wallet => wallet.balanceStamps, {onDelete: 'CASCADE'})
    wallet: Wallet;

    @Column('double precision')
    balance: number;

    @CreateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date;
}