import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserCredentialsDto } from './dtos/user-credentials.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource
    ) { }

    async findUser(username: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            username
        })

        if (!user) throw new Error('User not found');
        return user;
    }

    async createUser(credentials: UserCredentialsDto): Promise<User> {
        const existingUser = await this.findUser(credentials.username);

        if (existingUser) throw new Error('Username taken');

        const user = await this.userRepository.create(credentials);

        return await this.userRepository.save(user);
    }
}
