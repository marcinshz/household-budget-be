import { ApiProperty } from "@nestjs/swagger";

export class CreateDefaultCategoryDto {
    @ApiProperty()
    name: string;
}