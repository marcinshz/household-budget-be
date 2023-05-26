import { ApiProperty } from "@nestjs/swagger";
import { CategoryType } from "../category-types";

export class CreateDefaultCategoryDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    type: CategoryType
}