import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async createUser(@Body() credentials: UserCredentialsDto): Promise<User> {
        return await this.userService.createUser(credentials);
    }
}
