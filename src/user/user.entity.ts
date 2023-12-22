import {Category} from 'src/category/category.entity';
import {Wallet} from 'src/wallet/wallet.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Limit} from "../limit/limit.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    currency?: string;

    @OneToMany(() => Wallet, wallet => wallet.user)
    wallets: Wallet[];

    @OneToMany(() => Category, category => category.user)
    categories: Category

    @OneToMany(() => Limit, limit => limit.user)
    limits: Limit[];
}