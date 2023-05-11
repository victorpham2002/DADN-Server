import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, ResponeUserDto, UpdateUserDto } from "./dtos/user.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller('user')
export class UserController{
    constructor(
        private readonly userService : UserService
    ){}
    
    @Get(':username')
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Param('username') username: string): Promise<ResponeUserDto>{
        const user = await this.userService.getUser(username);
        return ResponeUserDto.plainToInstance(user);
    }

    
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllUser(@Body('password') adminPassword: String) : Promise<ResponeUserDto[]>{
        const userList = await this.userService.getAllUser(adminPassword);
        return ResponeUserDto.plainToInstance(userList);
    }

    @Post()
    async createNewUser(@Body() userObj : CreateUserDto) : Promise<ResponeUserDto>{
        const user = await this.userService.createNewUser(userObj);
        return ResponeUserDto.plainToInstance(user);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateUser(@Param('id') id: string, @Body() userObj: UpdateUserDto): Promise<ResponeUserDto>{
        const user = await this.userService.updateUser(id, userObj);
        return ResponeUserDto.plainToInstance(user);
    }

    @Delete(':id')
    // @UseGuards(AuthGuard('jwt'))
    async deleteUser(@Param('id') id: string): Promise<ResponeUserDto>{
        const user = await this.userService.deleteUser(id);
        return ResponeUserDto.plainToInstance(user);
    }
}