import {Wallet} from "src/wallet/wallet.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

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

    @Column({default: false})
    completed: boolean = false;

    @ManyToOne(() => User, user => user.goals)
    user: User;

    @OneToOne(() => Wallet)
    @JoinColumn()
    wallet: Wallet;
}
