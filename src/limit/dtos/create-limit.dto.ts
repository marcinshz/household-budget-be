import {Category} from "src/category/category.entity";
import {User} from "../../user/user.entity";

export class CreateLimitDto {
    category: Category;
    value: number;
    start: Date;
    deadline: Date;
    user: User;

    constructor(category: Category, value: number, start: Date, deadline: Date, user: User) {
        this.category = category;
        this.value = value;
        this.start = start;
        this.deadline = deadline;
        this.user = user;
    }
}