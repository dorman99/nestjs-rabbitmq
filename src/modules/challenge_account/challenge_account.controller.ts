import { Controller, Get, Param, Res, Put } from "@nestjs/common";
import { Types } from "mongoose";
import { AppResponse } from "src/common/response.base";
import { ChallengeAccountService } from "./challenge_account.service";

@Controller("challenges-accounts") 
export class ChallengeAccountController {
    constructor(
        private readonly challengeAccountService: ChallengeAccountService
    ) {}

    @Get('/accounts/:id')
    async findAccount(@Res() res, @Param("id") id: Types.ObjectId): Promise<AppResponse> {
        try {
            const challengesAccount = await this.challengeAccountService.findByAccount(id);
            if (!challengesAccount) {
                return AppResponse.badRequest(res, null);
            }
            return AppResponse.ok(res, challengesAccount);
        } catch (err) {
            return AppResponse.forbidden(res);
        }
    }

    @Put('/accounts/:id/challenges/:challengeId')
    async completeChallenge(@Param('id') id, @Param('challengeId') challengeId, @Res() res): Promise<AppResponse> {
        try {
            const account = await this.challengeAccountService.findByAccount(id);
            if (!account) {
                return AppResponse.forbidden(res);
            }
            account.challenges.forEach(c => {
                if (c._id.toString() == challengeId) {
                    c.status = true;
                }
            });
            await this.challengeAccountService.update(account);
            return AppResponse.accepted(res);
        } catch (err) {
            return AppResponse.forbidden(res);
        }
    }
}