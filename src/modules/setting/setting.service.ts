import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Garden } from "./schemas/garden.schema";
import mongoose, { Model, Mongoose, mongo } from "mongoose";
import { MapGardenDto } from "./dtos/garden.dto";
import * as _ from 'lodash';
import { UpdateConditionDto } from "./dtos/condition.dto";
import { Setting } from "./schemas/setting.schema";
import { Condition } from "./schemas/condition.schema";


@Injectable()
export class SettingService{
    constructor(
        @InjectModel(Garden.name) private gardenModel: Model<Garden>,
        @InjectModel(Setting.name) private settingModel: Model<Setting>,
        @InjectModel(Condition.name) private conditionModel: Model<Condition>,
    ){

    }

    async createGarden(userId: string, name: string, key: string){
        const checker =  await this.gardenModel.findOne({user: new mongoose.Types.ObjectId(userId), key});
        if(checker){
            throw new HttpException('Garden was existed', HttpStatus.CONFLICT);
        }
        return await this.gardenModel.create({name: name, key: key, user: new mongoose.Types.ObjectId(userId)})
    }

    async deleteGarden(userId: string, key: string){
        try{
            const garden = await this.gardenModel.findOneAndDelete({user: new mongoose.Types.ObjectId(userId) , key});
            return garden;
        }
        catch{
            throw new HttpException('User ID invaid', HttpStatus.UNAUTHORIZED);
            
        }
    }

    async tryCreateGarden(userId: string, name: string, key: string){
        try{
            await this.createGarden(userId, name, key);
            return 'success';
        }
        catch{
            return 'fail';
        }
    }

    async tryDeleteGarden(userId: string, key: string){
        try{
            await this.deleteGarden(userId, key);
            return 'success';
        }
        catch{
            return 'fail';
        }
    }

    async mapGardenFromAdafruit(userId: string, groups: MapGardenDto[]){
        groups = MapGardenDto.plainToInstance(groups);
        try{
            var gardenExisted = MapGardenDto.plainToInstance(await this.gardenModel.find({user: new mongoose.Types.ObjectId(userId)})) as MapGardenDto[];
        }
        catch{
            throw new HttpException('User ID does not exist', HttpStatus.UNAUTHORIZED);
        }
        const createGardens = _.differenceBy(groups, gardenExisted, 'name','key');
        const deleteGarden = _.differenceBy(gardenExisted, groups, 'name', 'key');

        const createRes = await Promise.all(createGardens.map(garden => this.tryCreateGarden(userId, garden.name, garden.key)))
        
        const deleteRes = await Promise.all(deleteGarden.map(garden => this.tryDeleteGarden(userId, garden.key)))

        if(createRes.includes('fail') || deleteRes.includes('fail')){
            return 'fail';
        }

        return 'success';
    }

    async updateCondition(userId: string, key: string, conditionData: UpdateConditionDto): Promise<any>{
        try{
            const setting = await this.getSetting(userId, key);
            const condition = await this.conditionModel.findOneAndUpdate({setting: setting._id, type: conditionData.type}, conditionData, {runValidators: true});
            return condition;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }

    }   

    async getConditions(userId: string, key: string): Promise<any[]>{
        try{
            const setting = await this.getSetting(userId, key);
            const conditions = await this.conditionModel.find({setting: setting._id});
            return conditions;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }

    async getSetting(userId: string, key: string){
        try{
            const garden = await this.gardenModel.findOne({user: new mongoose.Types.ObjectId(userId), key: key});
            const setting = await this.settingModel.findOne({garden: garden._id})
            return setting;
        }
        catch(err){
            console.log(err);
            throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
        }
    }
}