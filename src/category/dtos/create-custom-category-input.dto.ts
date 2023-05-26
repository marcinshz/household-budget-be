import { ApiProperty } from "@nestjs/swagger";
import { CategoryType } from "../category-types";

export class CreateCustomCategoryInputDto{
    @ApiProperty()
    name:string;

    @ApiProperty()
    userId:string;

    @ApiProperty()
    type:CategoryType;
}