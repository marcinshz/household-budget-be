import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {LimitService} from './limit.service';
import {CreateLimitInputDto} from './dtos/create-limit-input.dto';
import {Limit} from './limit.entity';
import {LimitCalculatedDto} from "./dtos/limit-calculated.dto";

@Controller('limit')
@ApiTags('limit')
export class LimitController {
    constructor(private limitService: LimitService) {
    }

    @Post()
    async createLimit(@Body() createLimitInputDto: CreateLimitInputDto): Promise<Limit> {
        return await this.limitService.createLimit(createLimitInputDto);
    }

    @Get('/:userId')
    async getUserLimits(@Param('userId') userId: string): Promise<LimitCalculatedDto[]> {
        return await this.limitService.getUserLimits(userId);
    }
}
