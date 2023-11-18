import {ApiProperty} from "@nestjs/swagger";

export class GetWalletsOverviewInputDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    period: string;
    @ApiProperty()
    wallets: {
        id: string;
        name: string;
        balance: number;
        checked: boolean;
    }[];
}