import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';
import { Weather } from 'src/model/weather';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WeatherPage implements OnInit {

  weather!: Weather[];
  forecastBaseUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  unit!: string;
  forecastUnit!: string;
  latitude!: number;
  longitude!: number;
  capital!: string;
  description!: string;
  iconBaseUrl = "https://openweathermap.org/img/wn/";
  iconUrl!: string;
  temperature!: number;
  apiKey = "50284dfe68111c3202262caf235e7ead";
  resultStatus!: number;
  forecastFlag!: boolean;
  
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
    this.unit = "metric";
    await this.dataService.set("unit", this.unit);
  }

  async getPageContent(){
      let result = await this.getServicesData();
      this.resultStatus = result.status;
      this.getWeatherDetails(result.data);
  }

  async getServicesData(){
      this.capital = await this.dataService.get('capital');
      this.latitude = await this.dataService.get('latitude');
      this.longitude = await this.dataService.get('longitude');
      this.options.url = this.options.url.concat(this.latitude + "&lon=" + this.longitude + "&units=" + this.unit + "&appid=" + this.apiKey);
      return await this.httpService.get(this.options); 
  }

  getWeatherDetails(result: any){
      this.description = result.weather[0].description;
      this.iconUrl = this.iconBaseUrl + result.weather[0].icon + ".png";
      this.temperature = result.main.temp;
  }

  viewForecast(){
    this.forecastFlag = !this.forecastFlag;
    if(this.forecastFlag){
      this.prepareForecast();
    } else {
      this.weather = [];
    }
  }

  async getForecastServicesData(){
    this.options.url = this.forecastBaseUrl + this.latitude + "&lon=" + this.longitude + "&units=" + this.unit + "&appid=" + this.apiKey;
    return  await this.httpService.get(this.options); 
  }

  async prepareForecast(){
    let result = await this.getForecastServicesData();
    this.weather = [];
    let forecastIndex = 1;
    let dateIndex = 1;
    result.data.list.forEach((element: any) => {
      if(forecastIndex %8 == 0){
        let dayDetails = {
          date: this.getTomorrowDate(dateIndex++),
          icon: this.iconBaseUrl + element.weather[0].icon + '.png',
          description: element.weather[0].description,
          temperature: element.main.temp,
        }
        this.weather.push(dayDetails);
      }
      forecastIndex ++;
    })
    this.getTemperatureUnit();
    this.forecastFlag = true;
  };

  private getTomorrowDate = (index: number): string => {

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + index);
    const day = String(tomorrow.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  private getTemperatureUnit(): string {
    
    switch (this.unit) {
      case 'metric':
          return this.forecastUnit = '°C';
      case 'imperial':
          return this.forecastUnit = '°F';
      case 'standard':
          return this.forecastUnit = 'K';
      default:
          throw new Error('Invalid temperature description. Use "metric", "imperial", or "standard".');
  }
  }
}
