import { ApiProperty } from "@nestjs/swagger";

export class CreateWalletInputDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    userId: string;
}