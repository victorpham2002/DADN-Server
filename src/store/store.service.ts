import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { StoreConfig } from './store.module';

@Injectable()
class StoreService {
    dirname : string;
    filename : string;
    path : string;

    constructor(@Inject('STORE_CONFIG') storeConfig: StoreConfig){
        this.dirname = storeConfig.dirname;
        this.filename = storeConfig.filename;
        this.path = this.dirname + '/' + this.filename;
    }

    save(data: any){
        fs.writeFileSync(this.path, JSON.stringify(data));
    }    

    load(){
        if(!fs.existsSync(this.path)){
            fs.mkdirSync(this.dirname);
            fs.writeFileSync(this.path, JSON.stringify({})); 
        }
        let rawdata = String(fs.readFileSync(this.path));
        return JSON.parse(rawdata);
    }
}

export {StoreService, StoreConfig}