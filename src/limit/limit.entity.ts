import { Category } from "src/category/category.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Limit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Category)
    @JoinColumn()
    category: Category;

    @Column()
    value: number;

    @Column()
    start: Date;

    @Column()
    deadline: Date;
}