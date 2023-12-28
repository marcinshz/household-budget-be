import {Category} from 'src/category/category.entity';
import {Wallet} from 'src/wallet/wallet.entity';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Limit} from "../limit/limit.entity";
import {Goal} from "../goal/goal.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({default: true})
    currency: string = 'EUR';

    @OneToMany(() => Wallet, wallet => wallet.user)
    wallets: Wallet[];
    
    @OneToMany(() => Goal, goal => goal.user)
    goals: Goal[];

    @OneToMany(() => Category, category => category.user)
    categories: Category

    @OneToMany(() => Limit, limit => limit.user)
    limits: Limit[];
}