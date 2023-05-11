import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import AdminConfig from "src/configs/admin/admin.config";
import { User, UserDocument } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { HttpException, NotFoundException } from "@nestjs/common/exceptions";
import { HttpStatus } from "@nestjs/common/enums";
import { CreateUserDto, ResponeUserDto, UpdateUserDto } from "./dtos/user.dto";
import { HttpService } from "@nestjs/axios/dist";
import AdafruitConfig from "src/configs/adafruit/adafruit.config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import * as bcrypt from 'bcrypt';
import bcryptConfig from "src/configs/bcrypt/bcrypt.config";
import { Garden } from "src/modules/setting/schemas/garden.schema";

const {password} = AdminConfig

const ADMIN_PASSWORD = password;

@Injectable()
export class UserService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly httpService: HttpService
    ){}

    async getAllUser(adminPassword : String): Promise<UserDocument[]>{
        if(adminPassword != ADMIN_PASSWORD){
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }
        let userList = await this.userModel.find({});
        return userList;
    }

    async getUser(username: string): Promise<UserDocument>{
        const user = await this.userModel.findOne({username: username});
        if(!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async getUserById(id: string): Promise<UserDocument>{
        try{
            var user = await this.userModel.findById(id);
        }
        catch(err){
            if(err){
                throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
            }
        }
        if(!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async createNewUser(userObj: CreateUserDto): Promise<UserDocument>{
        let usernameCheckObj = await this.userModel.exists({username: userObj.username});
        if(usernameCheckObj){
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        const url = `${AdafruitConfig.url}${AdafruitConfig.api.getUserInfo}?${AdafruitConfig.XAioKey}=${userObj.adafruitToken}`;
        let _ = await firstValueFrom(
            this.httpService.get(url)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException('AdafruitToken does not exist', HttpStatus.UNAUTHORIZED);
                    })
                )
        );
        const hashedPassword = await bcrypt.hash(userObj.password, bcryptConfig.rounds);
        userObj.password = hashedPassword;
        const user = await this.userModel.create(userObj);
        return user;
    }

    async updateUser(id: string, userObj: UpdateUserDto): Promise<UserDocument>{
        try{
            var user = this.userModel.findByIdAndUpdate(id, userObj, {new: true});
        }
        catch(err){
            if(err){
                throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
            }
        }
        return user;
    }

    async deleteUser(id : string){
        try{
            const user = await this.userModel.findByIdAndDelete(id);
            return user;
        }
        catch{
            throw new HttpException('User ID was not existed', HttpStatus.NOT_FOUND);
        }
    }

    async validateUser(username: string, password: string) : Promise<UserDocument>{
        const user = await this.getUser(username);
        if(!bcrypt.compareSync(password, user.password as string)){
            throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}