import { Body, Controller, Get, Post, Query, Res, Delete, Param, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { AppResponse } from "src/common/response.base";
import { ChallengeService } from "./challenge.service";
import { UpdateDto } from "./dto/update.dto";

@Controller("challenges")
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService
    ) {}

    @Get()
    async findAll(@Query('limit') limit, @Query('skip') skip, @Res() res): Promise<AppResponse> {
        try {
            let results = await this.challengeService.findAll(parseInt(limit || 10), parseInt(skip || 0));
            let pagination = {results: results, count: results.length};
            return AppResponse.ok(res, pagination);
        } catch (err) {
            return AppResponse.badRequest(res, []);
        }
    }

    @Post()
    async create(@Body() body, @Res() res): Promise<AppResponse> {
        try {
            await this.challengeService.create({name: body.name});
            return AppResponse.accepted(res);
        } catch (err) {
            return AppResponse.forbidden(res);
        }
    }

    @Delete('/:id')
    async remove(@Param('id') id, @Res() res): Promise<AppResponse> {
        try {
            await this.challengeService.remove(id);
            return AppResponse.accepted(res);
        } catch (err) {
            return AppResponse.forbidden(res);
        }
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id, @Body() body: UpdateDto, @Res() res): Promise<AppResponse> {
        try {
            let challenge = await this.challengeService.find(id);
            if (!challenge) {
                return AppResponse.forbidden(res);
            }
            await this.challengeService.update(id, body);
            return AppResponse.accepted(res)
        } catch (err) {
            console.log(err);
            return AppResponse.badRequest(res, err.message);
        }
    }
}