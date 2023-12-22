import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BalanceStamp} from "./balance-stamp.entity";
import {Wallet} from "../wallet/wallet.entity";
import {BalanceStampDto} from "./dtos/balance-stamp.dto";

@Injectable()
export class BalanceStampService {
    constructor(
        @InjectRepository(BalanceStamp)
        private balanceStampRepository: Repository<BalanceStamp>,
    ) {
    }

    async createBalanceStamp(wallet: Wallet, balance: number): Promise<BalanceStamp> {
        const currentDate = new Date();

        const result = await this.balanceStampRepository
            .createQueryBuilder('balanceStamp')
            .where('balanceStamp.walletId = :walletId', {walletId: wallet.id})
            .andWhere(`DATE_TRUNC('day', balanceStamp.createdAt) = :currentDate`, {currentDate: currentDate.toISOString().split('T')[0]})
            .getOne();

        if (result) {
            return await this.balanceStampRepository.save({
                ...result,
                balance,
                createdAt: new Date()
            });
        } else {
            const createBalanceStampDto = new BalanceStampDto(balance, wallet);
            const balanceStamp = this.balanceStampRepository.create(createBalanceStampDto);
            return await this.balanceStampRepository.save(balanceStamp);
        }
    }
}
