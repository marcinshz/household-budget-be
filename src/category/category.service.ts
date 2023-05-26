import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateDefaultCategoryDto } from './dtos/create-default-category.dto';
import { CreateCustomCategoryInputDto } from './dtos/create-custom-category-input.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateCustomCategoryDto } from './dtos/create-custom-category.dto';

/* 
    tworzenie defaultowej:
    sprawdza czy nie istnieje defaultowa o takiej nazwie {name, user=null}
    
    tworzenie customowej:
    sprawdza czy nie istnieje defaultowa o takiej nazwie {name, user=null}
    sprawdza czy nie istnieje customowa tego uzytkownika o takiej nazwie {name, user}    

*/


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private userService: UserService
    ) { }

    async getCustomCategory(name: string, user: User): Promise<Category> {
        if (!user) user = null;
        const category = await this.categoryRepository.findOne({
            relations: { user: true },
            where: { name, user: user }
        })
        console.log('user', user)
        console.log('category', category)
        return category
    }

    async getDefaultCategory(name: string): Promise<Category> {
        return await this.categoryRepository.findOne({
            relations: { user: true },
            where: { name, user: IsNull() }
        })
    }

    async createDefaultCategory(createDefaultCategoryDto: CreateDefaultCategoryDto): Promise<Category> {
        const existingCategory = await this.getDefaultCategory(createDefaultCategoryDto.name);

        if (existingCategory) throw new Error("Category already exists");

        const category = await this.categoryRepository.create(createDefaultCategoryDto);

        return await this.categoryRepository.save(category);
    }

    async createCustomCategory(createCustomCategoryInputDto: CreateCustomCategoryInputDto): Promise<Category> {
        const user = await this.userService.findUserById(createCustomCategoryInputDto.userId);
        if (!user) throw new NotFoundException("User not found");

        const existingCustomCategory = await this.getCustomCategory(createCustomCategoryInputDto.name, user);
        const existingDefaultCategory = await this.getDefaultCategory(createCustomCategoryInputDto.name);
        if (existingCustomCategory || existingDefaultCategory) throw new Error("Category already exists");

        const createCustomCategoryDto = new CreateCustomCategoryDto(createCustomCategoryInputDto.name, user);

        const category = await this.categoryRepository.create(createCustomCategoryDto);

        return await this.categoryRepository.save(category);
    }
}
