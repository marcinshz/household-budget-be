import {Category} from "src/category/category.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Limit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Category)
    @JoinColumn()
    category: Category;

    @Column('double precision')
    value: number;

    @Column()
    start: Date;

    @Column()
    deadline: Date;

    @ManyToOne(() => User, user => user.limits)
    user: User;
}