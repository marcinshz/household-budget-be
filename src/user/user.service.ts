import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
    async findUser(username: string): Promise<User> {
        return await this.userRepository.findOneBy({
            username
        });
    }

    async findUserById(id: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ["wallets", "wallets.expenses", "wallets.incomes"]
        });
    }

    async createUser(credentials: UserCredentialsDto): Promise<User> {
        const existingUser = await this.findUser(credentials.username);
        if (existingUser) throw new Error('Username taken');

        credentials.password = await bcrypt.hash(credentials.password, await bcrypt.genSalt());
        const user = await this.userRepository.create(credentials);

        return await this.userRepository.save(user);
    }
}
