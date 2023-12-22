import {Category} from "../../category/category.entity";

export class LimitCalculatedDto {
    id: string;
    category: Category;
    value: number;
    currentValue: number;
    start: Date;
    deadline: Date;
}