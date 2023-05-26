import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionService.createTransaction(createTransactionDto);
    }
}
