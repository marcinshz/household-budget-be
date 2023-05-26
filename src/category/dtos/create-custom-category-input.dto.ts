import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomCategoryInputDto{
    @ApiProperty()
    name:string;

    @ApiProperty()
    userId:string;
}