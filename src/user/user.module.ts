import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        HttpModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule{

}