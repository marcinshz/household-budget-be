import { ApiProperty } from "@nestjs/swagger";

export class CreateGoalInputDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    start: Date;
    @ApiProperty()
    deadline: Date;
    @ApiProperty()
    note: string
    @ApiProperty()
    value: number;
    @ApiProperty()
    userId:string;
}