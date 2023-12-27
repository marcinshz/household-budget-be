import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserCurrencyDto {
    @ApiProperty()
    currency: string;

    @ApiProperty()
    userId: string;
}