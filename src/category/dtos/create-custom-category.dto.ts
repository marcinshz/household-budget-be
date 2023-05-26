import { User } from "src/user/user.entity";
import { CategoryType } from "../category-types";

export class CreateCustomCategoryDto {
    constructor(name: string, user: User, type: CategoryType) {
        this.name = name;
        this.user = user;
        this.type = type;
    }

    name: string;
    user: User;
    type: CategoryType;
}