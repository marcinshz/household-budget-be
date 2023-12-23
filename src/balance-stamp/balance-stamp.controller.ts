import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {BalanceStampService} from "./balance-stamp.service";
import {BalanceStamp} from "./balance-stamp.entity";
import {CreateCustomDateBalanceStampDto} from "./dtos/create-custom-date-balance-stamp.dto";

@Controller('balance-stamp')
@ApiTags('balance-stamp')
export class BalanceStampController {
    constructor(private balanceStampService: BalanceStampService) {
    }

    @Post()
    async createBalanceStamp(@Body() createBalanceStampDto: CreateCustomDateBalanceStampDto): Promise<BalanceStamp> {
        return await this.balanceStampService.createCustomDateBalanceStamp(createBalanceStampDto);
    }
}
