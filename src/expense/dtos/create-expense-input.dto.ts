import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/category/category.entity";

export class CreateExpenseInputDto {
    @ApiProperty()
    categoryId: string;
    @ApiProperty()
    value: number;
    @ApiProperty()
    note: string;
    @ApiProperty()
    walletId: string;
}