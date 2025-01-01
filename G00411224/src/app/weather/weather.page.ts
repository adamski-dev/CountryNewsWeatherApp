import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WeatherPage implements OnInit {

  unit!: string;
  latitude!: number;
  longitude!: number;
  apiKey = "50284dfe68111c3202262caf235e7ead";
  resultStatus!: number;
  weatherData!: any;
  
  options: HttpOptions = {
        url: "https://api.openweathermap.org/data/2.5/weather?lat=",
      }

  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit() {

    this.getUnit();
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
    await this.dataService.set("unit", "metric");
  }

  async getPageContent(){
      this.unit = await this.dataService.get('unit');
      this.latitude = await this.dataService.get('latitude');
      this.longitude = await this.dataService.get('longitude');
      this.options.url = this.options.url.concat(this.latitude + "&lon=" + this.longitude + "&units=" + this.unit + "&appid=" + this.apiKey);
      let result = await this.httpService.get(this.options);
      this.weatherData = (result.status == 200) ? result.data : (this.resultStatus = result.status);
      console.log(this.weatherData);
  }
}
