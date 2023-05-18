import { User } from "src/user/user.entity";

export class CreateWalletDto {
    constructor(name: string, user: User) {
        this.name = name;
        this.user = user;
    }

    name: string;
    user: User;
}