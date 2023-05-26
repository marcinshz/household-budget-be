import { Body, Controller, Post } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalInputDto } from './dtos/create-goal-input.dto';
import { Goal } from './goal.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('goal')
@ApiTags('goal')
export class GoalController {
    constructor(private goalService: GoalService) { }

    @Post()
    async createGoal(@Body() createGoalInputDto: CreateGoalInputDto): Promise<Goal> {
        return await this.goalService.createGoal(createGoalInputDto);
    }
}