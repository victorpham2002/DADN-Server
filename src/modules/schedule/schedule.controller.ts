import { Controller, Post, Inject, UseGuards, Body, Delete, Param, Patch, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDeviceDto, UpdateDeviceDto } from "./dtos/device.dto";
import { ScheduleService } from "./schedule.service";
import { GetUser } from "../auth/decorators/getUser.decorator";
import { JwtPayload } from "../auth/types/jwtPayload.type";
import { userInfo } from "os";

@Controller('schedule')
export class ScheduleController{
    constructor(
        private readonly scheduleService: ScheduleService,
    ){}

    @Get('devices/:key')
    @UseGuards(AuthGuard('jwt'))
    async getDevices(@GetUser() userInfo: JwtPayload, @Param('key') key: string): Promise<ResponseDeviceDto[]>{
        const userId = userInfo.sub;
        const devices = await this.scheduleService.getDevices(userId, key);
        return ResponseDeviceDto.plainToInstance(devices);
    }

    @Patch('devices/:key')
    @UseGuards(AuthGuard('jwt'))
    async updateDevice(@GetUser() userInfo: JwtPayload, @Param('key') key: string, @Body() deviceData: UpdateDeviceDto): Promise<any>{
        const userId = userInfo.sub;
        const device = this.scheduleService.updateDevice(userId, key, deviceData);
        return device;
    }

}