import { Expense } from "src/expense/expense.entity";
import { Income } from "src/income/income.entity";

export class WalletCompleteInfoDto {
    constructor(id: string, name: string, value: number, incomes: Income[], expenses: Expense[]) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.incomes = incomes;
        this.expenses = expenses;
    }
    id: string;
    name: string;
    value: number;
    incomes: Income[];
    expenses: Expense[]
}