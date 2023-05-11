import { Controller, Post, Inject, UseGuards, Body, Delete, Param, Patch } from "@nestjs/common";
import { SettingService } from "./setting.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorators/getUser.decorator";
import { JwtPayload } from "../auth/types/jwtPayload.type";
import { CreateGardenDto, DeleteGardenDto, MapGardenDto, RepsonseGardenDto } from "./dtos/garden.dto";
import { ResponeUserDto } from "../user/dtos/user.dto";
import { Garden } from "./schemas/garden.schema";
import { ResponseConditionDto, UpdateConditionDto } from "./dtos/condition.dto";

@Controller('setting')
export class SettingController{
    constructor(
        private readonly settingService: SettingService,
    ){}
    
    @Patch('condition/:key')
    @UseGuards(AuthGuard('jwt'))
    async updateCondition(@GetUser() user: JwtPayload, @Param('key') key: string, @Body() conditionData: UpdateConditionDto){
        const userId = user.sub;
        const condition = await this.settingService.updateCondition(userId, key, conditionData);
        return condition;
    }
} 