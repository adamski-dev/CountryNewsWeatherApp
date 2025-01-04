import { Component, OnInit, Input } from '@angular/core';
import { IonButton, IonCard, IonCardSubtitle, IonImg, IonCardHeader, IonCardTitle } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { HttpOptions } from '@capacitor/core';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Forecast } from 'src/model/forecast';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonCardSubtitle, IonImg, IonCard, IonCardHeader, IonCardTitle, CommonModule]
})

export class ForecastComponent  implements OnInit {

  @Input() forecast!: Forecast[];
  forecastUnit!: string;
  forecastFlag!: boolean;
  unit!: string;
  iconBaseUrl = "https://openweathermap.org/img/wn/";
  apiKey = "50284dfe68111c3202262caf235e7ead";
  forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  options: HttpOptions = {
          url: "",
  }

  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit() {
    this.getUnit();
  }

  async getUnit(){
    this.unit = await this.dataService.get('unit');
  }

  viewForecast(){
    this.forecastFlag = !this.forecastFlag;
    if(this.forecastFlag){
      this.prepareForecast();
    } else {
      this.forecast = [];
    }
  }

  async prepareForecast(){
    let result = await this.getForecastServicesData();
    let forecastIndex = 1;
    this.forecast = [];
    let dateIndex = 1;
    result.data.list.forEach((element: any) => {
      if(forecastIndex %8 == 0){
        let dayDetails = {
          date: this.getForecastDate(dateIndex++),
          icon: this.iconBaseUrl + element.weather[0].icon + '@2x.png',
          description: element.weather[0].description,
          temperature: element.main.temp,
        }
        this.forecast.push(dayDetails);
      }
      forecastIndex ++;
    })
    this.getForecastTempUnit();
  };

  async getForecastServicesData(){
    let country = await this.dataService.get('country');
    this.options.url = this.forecastUrl 
                      + country.latitude 
                      + "&lon=" + country.longitude 
                      + "&units=" + this.unit 
                      + "&appid=" + this.apiKey;
    return  await this.httpService.get(this.options); 
  }

  getForecastDate(index: number): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + index);
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
    return `${day}-${month}-${year}`;
  };

  getForecastTempUnit(): string {
    switch (this.unit) {
      case 'metric':
          return this.forecastUnit = '°C';
      case 'imperial':
          return this.forecastUnit = '°F';
      case 'standard':
          return this.forecastUnit = 'K';
      default:
          throw new Error('Invalid temperature description. Only "metric", "imperial", or "standard" are available.');
    }
  }
}