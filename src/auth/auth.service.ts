import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from 'src/user/dtos/user-credentials.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import UserAuthenticatedDto from './user-authenticated.dto';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(credentials: UserCredentialsDto):Promise<UserAuthenticatedDto>{
        const user = await this.userService.findUser(credentials.username);

        if (!await bcrypt.compare(credentials.password, user.password)) throw new UnauthorizedException();

        const payload = { username: user.username, sub: user.id };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user
        }
    }
}
