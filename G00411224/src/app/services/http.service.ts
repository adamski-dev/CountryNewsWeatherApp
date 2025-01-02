import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  public async get(options: HttpOptions){
    return await CapacitorHttp.get(options);
  }
}
