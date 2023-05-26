import { ApiProperty } from "@nestjs/swagger";

export class CreateExpenseInputDto {
    constructor(categoryId: string, value: number, note: string, walletId: string) {
        this.categoryId = categoryId;
        this.value = value;
        this.note = note;
        this.walletId = walletId;
    }

    @ApiProperty()
    categoryId: string;
    @ApiProperty()
    value: number;
    @ApiProperty()
    note: string;
    @ApiProperty()
    walletId: string;
}