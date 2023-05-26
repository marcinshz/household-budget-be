import { Category } from "src/category/category.entity";

export class CreateLimitDto {
    constructor(category:Category, value:number, start:Date, deadline:Date) {
        this.category = category;
        this.value = value;
        this.start = start;
        this.deadline = deadline;
    }

    category: Category;
    value: number;
    start: Date;
    deadline: Date;
}