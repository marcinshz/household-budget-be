import { User } from "src/user/user.entity";

export class CreateWalletDto {
    constructor(name: string, balance:number, user: User) {
        this.name = name;
        this.balance = balance;
        this.user = user;
    }

    name: string;
    balance:number;
    user: User;
}