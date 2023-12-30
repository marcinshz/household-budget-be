import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Goal} from './goal.entity';
import {Repository} from 'typeorm';
import {CreateGoalInputDto} from './dtos/create-goal-input.dto';
import {CreateGoalDto} from './dtos/create-goal.dto';
import {UserService} from "../user/user.service";
import {WalletService} from "../wallet/wallet.service";

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
        private userService: UserService,
        @Inject(forwardRef(() => WalletService))
        private walletService: WalletService,
    ) {
    }

    async createGoal(createGoalInputDto: CreateGoalInputDto): Promise<Goal> {
        const {name, start, deadline, note, value, userId} = createGoalInputDto;
        const wallet = await this.walletService.createWallet({name: name + ' - Savings', balance: 0, userId, savingsWallet: true});
        const user = await this.userService.findUserById(userId);

        const createGoalDto = new CreateGoalDto(name, start, deadline, value, note, wallet, user)

        const createdGoal = this.goalRepository.create(createGoalDto);

        return await this.goalRepository.save(createdGoal);
    }

    async getGoals(userId: string): Promise<Goal[]> {
        return await this.goalRepository.find({
            relations: ['user', 'user', 'wallet', 'wallet.balanceStamps'],
            where: {user: {id: userId}}
        });
    }

    async updateGoalCompleted(walletId: string, balance: number): Promise<Goal> {
        const goal = await this.goalRepository.findOne({
            relations: ['wallet'],
            where: {wallet: {id: walletId}},
        })

        if (goal) {
            if (goal.value <= balance) {
                goal.completed = true;
                return await this.goalRepository.save(goal);
            }
        }
        return;
    }
}
