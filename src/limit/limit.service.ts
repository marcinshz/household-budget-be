import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Limit } from './limit.entity';
import { Repository } from 'typeorm';
import { CreateLimitInputDto } from './dtos/create-limit-input.dto';
import { CategoryService } from 'src/category/category.service';
import { CreateLimitDto } from './dtos/create-limit.dto';

@Injectable()
export class LimitService {
    constructor(
        @InjectRepository(Limit)
        private limitRepository: Repository<Limit>,
        private categoryService: CategoryService
    ) { }

    async createLimit(createLimitInputDto: CreateLimitInputDto): Promise<Limit> {
        const { categoryId, value, start, deadline } = createLimitInputDto;

        const category = await this.categoryService.getCategoryById(categoryId);

        if (!category) throw new NotFoundException("Category not found");

        const createLimitDto = new CreateLimitDto(category, value, start, deadline);

        const createdLimit = this.limitRepository.create(createLimitDto);

        return await this.limitRepository.save(createdLimit);
    }
}
