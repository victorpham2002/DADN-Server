import { Controller, Post, Inject, UseGuards, Body, Delete, Param, Patch, Get, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDeviceDto, UpdateDeviceDto } from "./dtos/device.dto";
import { ScheduleService } from "./schedule.service";
import { GetUser } from "../auth/decorators/getUser.decorator";
import { JwtPayload } from "../auth/types/jwtPayload.type";
import { userInfo } from "os";
import { CreateTimeDto, ResponseTimeDto, TimeQuerryDto, UpdateTimeDto } from "./dtos/time.dto";
import { query } from "express";
import { ApiQuery } from "@nestjs/swagger";
import { DeviceTypes } from "./schemas/types/device.type";

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

    @Post('times')
    @UseGuards(AuthGuard('jwt'))
    @ApiQuery({name: 'key'})
    @ApiQuery({name: 'deviceType', enum: DeviceTypes})
    async createTime(@GetUser() userInfo: JwtPayload, @Query() query: TimeQuerryDto, @Body() timeData: CreateTimeDto): Promise<ResponseTimeDto>{
        console.log(timeData);
        const userId = userInfo.sub;
        const time = await this.scheduleService.createTime(userId, query.key, query.deviceType, timeData);
        return ResponseTimeDto.plainToInstance(time);
    }

    @Get('times')
    @UseGuards(AuthGuard('jwt'))
    @ApiQuery({name: 'key'})
    @ApiQuery({name: 'deviceType', enum: DeviceTypes})
    
    async getTimes(@GetUser() userInfo: JwtPayload, @Query() query: TimeQuerryDto): Promise<ResponseTimeDto[]>{
        const userId = userInfo.sub;
        const times = await this.scheduleService.getTimes(userId, query.key, query.deviceType);
        return ResponseTimeDto.plainToInstance(times);
    }

    @Patch('times/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateTime(@Param('id') id: string, @Body() timeData: UpdateTimeDto): Promise<ResponseTimeDto>{
        const time = await this.scheduleService.updateTime(id, timeData);
        return ResponseTimeDto.plainToInstance(time);
    }

    @Delete('times/:id')
    @UseGuards(AuthGuard('jwt'))
    async deleteTime(@Param('id') id: string): Promise<ResponseTimeDto>{
        const time = await this.scheduleService.deleteTime(id);
        return ResponseTimeDto.plainToInstance(time);
    }

}