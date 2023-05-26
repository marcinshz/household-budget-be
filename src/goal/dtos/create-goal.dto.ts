import { Wallet } from "src/wallet/wallet.entity";

export class CreateGoalDto {
    constructor(name: string, start: Date, deadline: Date, value: number, note: string, wallet: Wallet) {
        this.name = name;
        this.start = start;
        this.deadline = deadline;
        this.value = value;
        this.note = note;
        this.wallet = wallet;
    }

    name: string;
    start: Date;
    deadline: Date;
    value: number;
    note: string;
    wallet: Wallet
}