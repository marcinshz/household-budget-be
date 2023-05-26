import { Category } from "src/category/category.entity";
import { Wallet } from "src/wallet/wallet.entity";

export class CreateExpenseDto {
    constructor(wallet: Wallet, category: Category, value: number, note: string) {
        this.wallet = wallet;
        this.category = category;
        this.value = value;
        this.note = note;
    }

    wallet: Wallet;
    category: Category;
    value: number;
    note: string;
}