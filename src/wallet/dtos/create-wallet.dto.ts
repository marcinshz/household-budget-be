import {User} from "src/user/user.entity";

export class CreateWalletDto {
    name: string;
    balance: number;
    user: User;
    savingsWallet?: boolean;

    constructor(name: string, balance: number, user: User, savingsWallet?: boolean) {
        this.name = name;
        this.balance = balance;
        this.user = user;
        this.savingsWallet = savingsWallet;
    }
}