import {ApiProperty} from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty()
    senderWalletId: string;
    @ApiProperty()
    senderCategoryId: string;

    @ApiProperty()
    receiverWalletId: string;
    @ApiProperty()
    receiverCategoryId: string;

    @ApiProperty()
    value: number;
}