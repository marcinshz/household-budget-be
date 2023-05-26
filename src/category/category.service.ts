import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateDefaultCategoryDto } from './dtos/create-default-category.dto';
import { CreateCustomCategoryInputDto } from './dtos/create-custom-category-input.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateCustomCategoryDto } from './dtos/create-custom-category.dto';
import { CategoryType } from './category-types';
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private userService: UserService
    ) { }

    async getCustomCategory(name: string, user: User, type: CategoryType): Promise<Category> {
        return await this.categoryRepository.findOne({
            relations: { user: true },
            where: { name, user: user, type }
        })
    }

    async getDefaultCategory(name: string, type: CategoryType): Promise<Category> {
        return await this.categoryRepository.findOne({
            relations: { user: true },
            where: { name, user: IsNull(), type }
        })
    }

    async createDefaultCategory(createDefaultCategoryDto: CreateDefaultCategoryDto): Promise<Category> {
        const existingCategory = await this.getDefaultCategory(createDefaultCategoryDto.name, createDefaultCategoryDto.type);

        if (existingCategory) throw new Error("Category already exists");

        const category = await this.categoryRepository.create(createDefaultCategoryDto);

        return await this.categoryRepository.save(category);
    }

    async createCustomCategory(createCustomCategoryInputDto: CreateCustomCategoryInputDto): Promise<Category> {
        const user = await this.userService.findUserById(createCustomCategoryInputDto.userId);
        if (!user) throw new NotFoundException("User not found");

        const existingCustomCategory = await this.getCustomCategory(createCustomCategoryInputDto.name, user, createCustomCategoryInputDto.type);
        const existingDefaultCategory = await this.getDefaultCategory(createCustomCategoryInputDto.name, createCustomCategoryInputDto.type);
        if (existingCustomCategory || existingDefaultCategory) throw new Error("Category already exists");

        const createCustomCategoryDto = new CreateCustomCategoryDto(createCustomCategoryInputDto.name, user, createCustomCategoryInputDto.type);

        const category = await this.categoryRepository.create(createCustomCategoryDto);

        return await this.categoryRepository.save(category);
    }

    async removeCustomCategory(id: string) {
        return await this.categoryRepository.delete({id});
    }
}
