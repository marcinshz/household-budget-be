import {Body, Controller, Get, Post, Put} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './user.entity';
import {ApiTags} from '@nestjs/swagger';
import {UserCredentialsDto} from './dtos/user-credentials.dto';
import {UpdateUserCurrencyDto} from "./dtos/update-user-currency.dto";

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post()
    async createUser(@Body() credentials: UserCredentialsDto): Promise<User> {
        return await this.userService.createUser(credentials);
    }

    @Put()
    async updateUserCurrency(@Body() updateUserCurrencyDto: UpdateUserCurrencyDto): Promise<User> {
        return await this.userService.updateUserCurrency(updateUserCurrencyDto);
    }

    @Get()
    async getUsers(): Promise<User[]> {
        return await this.userService.getUsers();
    }
}
