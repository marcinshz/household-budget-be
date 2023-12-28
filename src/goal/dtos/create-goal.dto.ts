import {Wallet} from "src/wallet/wallet.entity";
import {User} from "../../user/user.entity";

export class CreateGoalDto {
    name: string;
    start: Date;
    deadline: Date;
    value: number;
    note: string;
    wallet: Wallet
    user: User;

    constructor(name: string, start: Date, deadline: Date, value: number, note: string, wallet: Wallet, user: User) {
        this.name = name;
        this.start = start;
        this.deadline = deadline;
        this.value = value;
        this.note = note;
        this.wallet = wallet;
        this.user = user
    }
}