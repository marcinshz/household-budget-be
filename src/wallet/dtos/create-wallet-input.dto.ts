import {ApiProperty} from "@nestjs/swagger";

export class CreateWalletInputDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    balance: number;
    @ApiProperty()
    savingsWallet: boolean;
}