export class WalletShortInfo {
    constructor(id: string, name: string, value: number) {
        this.id = id;
        this.name = name;
        this.value = value;
    }
    id: string;
    name: string;
    value: number;
}