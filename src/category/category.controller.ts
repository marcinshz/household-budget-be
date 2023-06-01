import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateDefaultCategoryDto } from './dtos/create-default-category.dto';
import { CreateCustomCategoryInputDto } from './dtos/create-custom-category-input.dto';
import { CategoryType } from './category-types';

@Controller('category')
@ApiTags('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Post('default-category')
    async createDefaultCategory(@Body() createDefaultCategoryDto: CreateDefaultCategoryDto): Promise<Category> {
        return await this.categoryService.createDefaultCategory(createDefaultCategoryDto);
    }

    @Post('custom-category')
    async createCustomCategory(@Body() createCustomCategoryInputDto: CreateCustomCategoryInputDto): Promise<Category> {
        return await this.categoryService.createCustomCategory(createCustomCategoryInputDto);
    }

    @Delete(':id')
    async removeCustomCategory(@Param('id') id: string) {
        return await this.categoryService.removeCustomCategory(id);
    }

    @Get(':type')
    async getCategoriesByType(@Param('type') type: string): Promise<Category[]> {
        return await this.categoryService.getCategoriesByType(type === 'income' ? CategoryType.income : CategoryType.expense);
    }
}
