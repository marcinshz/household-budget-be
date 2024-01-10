import {User} from "src/user/user.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryType} from "./category-types";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: CategoryType;

    @ManyToOne(() => User, user => user.categories)
    user?: User;
}