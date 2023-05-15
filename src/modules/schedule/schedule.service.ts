import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Device } from "./schemas/device.schema";
import { Model } from "mongoose";
import { Time } from "./schemas/time.schema";
import { UpdateDeviceDto } from "./dtos/device.dto";
import { SettingService } from "../setting/setting.service";
import { HttpStatusCode } from "axios";
import { set } from "lodash";
import { CreateTimeDto } from "./dtos/time.dto";
import { DeviceTypes } from "./schemas/types/device.type";

@Injectable()
export class ScheduleService{
    constructor(
        @InjectModel(Device.name) private deviceModel: Model<Device>,
        @InjectModel(Time.name) private timeModel: Model<Time>,
        private readonly settingService: SettingService,
    ){}

    async updateDevice(userId: string, key: string, deviceData: UpdateDeviceDto): Promise<any>{
        try{
            const setting = await this.settingService.getSetting(userId, key);
            const device = await this.deviceModel.updateOne({setting: setting._id, type: deviceData.type}, deviceData);
            return device;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }

    async getDevices(userId: string, key: string): Promise<any[]> {
        try{
            const setting = await this.settingService.getSetting(userId, key);
            const devices = await this.deviceModel.find({setting: setting._id});
            return devices;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }

    async createTime(userId: string, key: string, deviceType: DeviceTypes, timeData: CreateTimeDto): Promise<any>{
        try{
            const setting = await this.settingService.getSetting(userId, key);
            const device = await this.deviceModel.findOne({setting: setting._id, type: deviceType});
            const time = await this.timeModel.create({...timeData, device: device._id});
            return time;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }

    async getTimes(userId: string, key: string, deviceType: DeviceTypes): Promise<any[]>{
        try{
            const setting = await this.settingService.getSetting(userId, key);
            const device = await this.deviceModel.findOne({setting: setting._id, type: deviceType});
            const times = await this.timeModel.find({device: device._id});
            return times;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }

    async updateTime(){}
    
}