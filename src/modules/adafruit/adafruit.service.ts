import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { AuthService } from "src/modules/auth/auth.service";
import AdafruitConfig from "src/configs/adafruit/adafruit.config";
import { AxiosError } from "axios";
import { GroupDto } from "./dtos/groups.dto";
import { ChangeFanSpeedDto, CreateDataDto } from "./dtos/data.dto";
import { SettingService } from "../setting/setting.service";
import { CreateGardenDto, MapGardenDto } from "../setting/dtos/garden.dto";


@Injectable()
export class AdafruitService{
    constructor(
        private readonly httpService: HttpService,
        private readonly authService: AuthService,
        private readonly settingService: SettingService,
    ){}

    async getGroups(userId: string) : Promise<any[]>{
        const {adafruitToken, adafruitUsername} = this.authService.getOnlineUser(userId);
        const url = `${AdafruitConfig.url}/api/v2/${adafruitUsername}/groups?${AdafruitConfig.XAioKey}=${adafruitToken}`;
        const res = await firstValueFrom(
            this.httpService.get(url)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException(error.message, Number(error.code));
                    })
                )
        );

        const data = res.data as MapGardenDto[];
        const mapDatas = data.filter(data => data.key != 'default') as MapGardenDto[];
        await this.settingService.mapGardenFromAdafruit(userId, mapDatas);
        return mapDatas;
    }    

    async getFeedData(userId: string, feedKey: string) : Promise<any[]>{
        const {adafruitToken, adafruitUsername} = this.authService.getOnlineUser(userId);
        const url = `${AdafruitConfig.url}/api/v2/${adafruitUsername}/feeds/${feedKey}/data?${AdafruitConfig.XAioKey}=${adafruitToken}`;
        const res = await firstValueFrom(
            this.httpService.get(url)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException(error.message, Number(error.code));
                    })
                )
        );
        
        const data = (res.data as any[]).map(value => value.value);
        return data;
    }

    async createFeedData(userId: string, feedKey: string, data: CreateDataDto) : Promise<any>{
        const {adafruitToken, adafruitUsername} = this.authService.getOnlineUser(userId);
        const url = `${AdafruitConfig.url}/api/v2/${adafruitUsername}/feeds/${feedKey}/data?${AdafruitConfig.XAioKey}=${adafruitToken}`;
        const res = await firstValueFrom(
            this.httpService.post(url, data)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException(error.message, error.status);
                    })
                )
        )      
        return res.data;
    } 

    async turnPumpOn(userId: string, groupKey: string) : Promise<any>{
        return this.createFeedData(userId, `${groupKey}.pump`, {value: 3} as CreateDataDto);
    }

    async turnPumpOff(userId: string, groupKey: string) : Promise<any>{
        return this.createFeedData(userId, `${groupKey}.pump`, {value: 2} as CreateDataDto);
    }

    async changeFanSpeed(userId: string, groupKey: string, fanSpeed: ChangeFanSpeedDto) : Promise<any>{
        return this.createFeedData(userId, `${groupKey}.fan`, fanSpeed);
    }


}