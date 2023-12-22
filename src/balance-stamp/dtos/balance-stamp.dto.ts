import {Wallet} from "../../wallet/wallet.entity";

export class BalanceStampDto {
    balance: number;
    wallet: Wallet;

    constructor(balance: number, wallet: Wallet) {
        this.balance = balance;
        this.wallet = wallet;
    }
}