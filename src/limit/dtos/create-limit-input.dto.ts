import {ApiProperty} from "@nestjs/swagger";

export class CreateLimitInputDto {
    @ApiProperty()
    categoryId: string;
    @ApiProperty()
    value: number;
    @ApiProperty()
    start: Date;
    @ApiProperty()
    deadline: Date;
    @ApiProperty()
    userId: string;
}