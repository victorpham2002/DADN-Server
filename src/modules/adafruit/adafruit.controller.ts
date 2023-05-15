import { Controller, UseGuards, Get, Post, Put, Patch, Delete, Param , Body} from "@nestjs/common";
import { AdafruitService } from "./adafruit.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/modules/auth/decorators/getUser.decorator";
import { JwtPayload } from "src/modules/auth/types/jwtPayload.type";
import { FeedDto, GroupDto } from "./dtos/groups.dto";
import { plainToInstance } from "class-transformer";
import { ChangeFanSpeedDto, CreateDataDto, ResponseDataDto } from "./dtos/data.dto";
import { group } from "console";


@Controller('adafruit')
export class AdafruitController{
    constructor(
        private readonly adafruitService: AdafruitService,
    ){}

    @Get('groups')
    @UseGuards(AuthGuard('jwt'))
    async getGroups(@GetUser() user: JwtPayload) : Promise<GroupDto[]>{
        const data = await this.adafruitService.getGroups(user.sub);
        const groups = GroupDto.plainToInstance(data);
        return groups;
    }

    @Get('data/:feedKey')
    @UseGuards(AuthGuard('jwt'))
    async getFeedData(@GetUser() user: JwtPayload, @Param('feedKey') feedKey: string) : Promise<any[]>{
        const data = await this.adafruitService.getFeedData(user.sub, feedKey);
        return data;
    }

    @Post('data/:feedKey')
    @UseGuards(AuthGuard('jwt'))
    async createFeedData(@GetUser() user: JwtPayload, @Param('feedKey') feedKey: string, @Body() data: CreateDataDto) : Promise<ResponseDataDto>{
        const resData = await this.adafruitService.createFeedData(user.sub, feedKey, data);
        return ResponseDataDto.plainToInstance(resData);
    }

    @Post(':groupKey/pump_on')
    @UseGuards(AuthGuard('jwt'))
    async turnPumpOn(@GetUser() user: JwtPayload, @Param('groupKey') groupKey: string) : Promise<ResponseDataDto>{
        const data = await this.adafruitService.turnPumpOn(user.sub, groupKey);
        return ResponseDataDto.plainToInstance(data);
    }

    @Post(':groupKey/pump_off')
    @UseGuards(AuthGuard('jwt'))
    async turnPumpOff(@GetUser() user: JwtPayload, @Param('groupKey') groupKey: string) : Promise<ResponseDataDto>{
        const data = await this.adafruitService.turnPumpOff(user.sub, groupKey);
        return ResponseDataDto.plainToInstance(data);
    }

    @Post(':groupKey/fan_speed')
    @UseGuards(AuthGuard('jwt'))
    async changeFanSpeed(@GetUser() user: JwtPayload, @Param('groupKey') groupKey: string, @Body() fanSpeed: ChangeFanSpeedDto) : Promise<ResponseDataDto>{
        const data = await this.adafruitService.changeFanSpeed(user.sub, groupKey, fanSpeed);
        return ResponseDataDto.plainToInstance(data);
    }
}