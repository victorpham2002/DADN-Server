import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import MongoDBConfig from './configs/database/mongodb/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { AdafruitModule } from './modules/adafruit/adafruit.module';
import { ConfigModule } from '@nestjs/config';
import { SettingModule } from './modules/setting/setting.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
const {
  username,
  password,
  cluster,
  dbname,
} = MongoDBConfig;

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`),
    AuthModule,
    AdafruitModule,
    ConfigModule.forRoot(),
    SettingModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
