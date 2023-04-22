import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import AdafruitConfig from "src/configs/adafruit/adafruit.config";
import { AxiosError } from "axios";
import { GroupDto } from "./dtos/groups.dto";


@Injectable()
export class AdafruitService{
    constructor(
        private readonly httpService: HttpService,
        private readonly authService: AuthService
    ){}

    async getGroups(userId: string) : Promise<any[]>{
        const {adafruitToken, adafruitUsername} = this.authService.getOnlineUser(userId);
        const url = `${AdafruitConfig.url}/api/v2/${adafruitUsername}/groups?${AdafruitConfig.XAioKey}=${adafruitToken}`;
        const res = await firstValueFrom(
            this.httpService.get(url)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException('AdafruitToken does not exist', HttpStatus.UNAUTHORIZED);
                    })
                )
        );

        const data = res.data as Object[];
        return data;
    }    
}