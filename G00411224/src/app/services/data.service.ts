import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    await this.storage.create();
  }

  async set(key: string, value: any){
    await this.storage.set(key, value);
  }

  async get(key: string){
    return await this.storage.get(key);
  }

}
