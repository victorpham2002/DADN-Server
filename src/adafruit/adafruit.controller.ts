import { Controller, UseGuards, Get, Post, Put, Patch, Delete } from "@nestjs/common";
import { AdafruitService } from "./adafruit.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/decorators/getUser.decorator";
import { JwtPayload } from "src/auth/types/jwtPayload.type";
import { FeedDto, GroupDto } from "./dtos/groups.dto";
import { plainToInstance } from "class-transformer";


@Controller('adafruit')
export class AdafruitController{
    constructor(
        private readonly adafruitService: AdafruitService,
    ){}

    @Get('groups')
    @UseGuards(AuthGuard('jwt'))
    async getGroups(@GetUser() user: JwtPayload) : Promise<GroupDto[]>{
        const data = await this.adafruitService.getGroups(user.sub);
        let groups = (GroupDto.plainToInstance(data) as GroupDto[]).filter(group => group.key !== 'default');
        return groups;
    }
}