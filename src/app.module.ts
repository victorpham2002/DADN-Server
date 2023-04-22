import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import MongoDBConfig from './configs/database/mongodb/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdafruitModule } from './adafruit/adafruit.module';

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
    AdafruitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
