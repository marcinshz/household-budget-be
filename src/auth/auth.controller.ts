import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserCredentialsDto} from 'src/user/dtos/user-credentials.dto';
import {ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import UserAuthenticatedDto from './user-authenticated.dto';
import {VerifyDto} from "./verify.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('sign-in')
    async signIn(@Body() credentials: UserCredentialsDto): Promise<UserAuthenticatedDto> {
        return await this.authService.signIn(credentials);
    }

    @Get('verify-token/:token')
    async verifyToken(@Param('token') token: string): Promise<VerifyDto> {
        return await this.authService.verifyToken(token);
    }
}
