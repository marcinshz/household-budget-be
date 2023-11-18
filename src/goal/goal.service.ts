import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { Repository } from 'typeorm';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateGoalInputDto } from './dtos/create-goal-input.dto';
import { CreateGoalDto } from './dtos/create-goal.dto';

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
        private walletService: WalletService
    ) { }

    async createGoal(createGoalInputDto: CreateGoalInputDto): Promise<Goal> {
        const { name, start, deadline, note, value, userId } = createGoalInputDto;
        const wallet = await this.walletService.createWallet({ name, balance:0, userId });

        const createGoalDto = new CreateGoalDto(name, start, deadline, value, note, wallet)

        const createdGoal = this.goalRepository.create(createGoalDto);

        return await this.goalRepository.save(createdGoal);
    }
}
