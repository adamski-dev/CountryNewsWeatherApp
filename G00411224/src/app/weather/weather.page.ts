import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WeatherPage implements OnInit {

  unit!: string;
  latitude!: number;
  longitude!: number;
  capital!: string;
  description!: string;
  iconUrl: string = "https://openweathermap.org/img/wn/";
  temperature!: number;
  apiKey = "50284dfe68111c3202262caf235e7ead";
  resultStatus!: number;
  
  options: HttpOptions = {
        url: "https://api.openweathermap.org/data/2.5/weather?lat=",
  }

  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit() {
    this.getUnit();
    this.getCapital();
    this.getPageContent();
  }

  async getUnit(){
    await this.dataService.get('unit').then(data =>{
      if(!data){
        this.setDefaultUnit();
      }else {
        this.unit = data;
      }
    });
  }

  async setDefaultUnit(){
    this.unit = "metric";
    await this.dataService.set("unit", this.unit);
  }

  async getPageContent(){
      let result = await this.getServicesData();
      this.resultStatus = result.status;
      this.getWeatherDetails(result.data);
  }

  async getServicesData(){
      this.latitude = await this.dataService.get('latitude');
      this.longitude = await this.dataService.get('longitude');
      this.options.url = this.options.url.concat(this.latitude + "&lon=" + this.longitude + "&units=" + this.unit + "&appid=" + this.apiKey);
      return await this.httpService.get(this.options); 
  }

  getWeatherDetails(result: any){
      this.description = result.weather[0].description;
      this.iconUrl = this.iconUrl.concat(result.weather[0].icon + ".png");
      this.temperature = result.main.temp;
  }

  async getCapital(){
    this.capital = await this.dataService.get('capital');
  }
}
