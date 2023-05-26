import { Category } from 'src/category/category.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    username:string;

    @Column()
    password:string;

    @OneToMany(() => Wallet, wallet => wallet.user)
    wallets:Wallet;

    @OneToMany(() => Category, category => category.user)
    categories:Category
}