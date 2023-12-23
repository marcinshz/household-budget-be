import {Wallet} from "../../wallet/wallet.entity";

export class CreateCustomDateBalanceStampDto {
    balance: number
    wallet: Wallet;
    createdAt: Date

    constructor(balance: number, wallet: Wallet, createdAt: Date) {
        this.balance = balance
        this.wallet = wallet
        this.createdAt = createdAt
    }
}