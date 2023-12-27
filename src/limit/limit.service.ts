import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Limit} from './limit.entity';
import {Repository} from 'typeorm';
import {CreateLimitInputDto} from './dtos/create-limit-input.dto';
import {CategoryService} from 'src/category/category.service';
import {CreateLimitDto} from './dtos/create-limit.dto';
import {UserService} from "../user/user.service";
import {ExpenseService} from "../expense/expense.service";
import {LimitCalculatedDto} from "./dtos/limit-calculated.dto";

@Injectable()
export class LimitService {
    constructor(
        @InjectRepository(Limit)
        private limitRepository: Repository<Limit>,
        private categoryService: CategoryService,
        private userService: UserService,
        private expenseService: ExpenseService
    ) {
    }

    async createLimit(createLimitInputDto: CreateLimitInputDto): Promise<Limit> {
        const {categoryId, value, start, deadline, userId} = createLimitInputDto;

        const category = await this.categoryService.getCategoryById(categoryId);
        const user = await this.userService.findUserById(userId);

        if (!category) throw new NotFoundException("Category not found");
        if (!user) throw new NotFoundException("User not found");

        const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
        const createLimitDto = new CreateLimitDto(category, parsedValue, start, deadline, user);

        const createdLimit = this.limitRepository.create(createLimitDto);

        return await this.limitRepository.save(createdLimit);
    }

    async getUserLimits(userId: string): Promise<LimitCalculatedDto[]> {
        let limits = await this.limitRepository.find({
            relations: {category: true},
            where: {user: {id: userId}},
        });

        return await Promise.all(limits.map(async (limit) => {
            const expenses = await this.expenseService.getCategoryExpensesPeriod(limit);
            let currentValue = 0;

            expenses.forEach((expense) => {
                currentValue += expense.value;
            })

            return {
                ...limit,
                currentValue: currentValue
            }
        }));
    }
}
