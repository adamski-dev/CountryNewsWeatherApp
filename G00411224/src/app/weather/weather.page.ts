import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';
import { Weather } from 'src/model/weather';
import { Forecast } from 'src/model/forecast';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WeatherPage implements OnInit {

  weather!: Weather;
  forecast!: Forecast[];
  forecastBaseUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  unit!: string;
  forecastUnit!: string;
  capital!: string;
  iconBaseUrl = "https://openweathermap.org/img/wn/";
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

  /*
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
      this.iconUrl = this.iconBaseUrl + result.weather[0].icon + "@2x.png";
      this.temperature = result.main.temp;
  }
  */

  async getPageContent(){
    let country = await this.dataService.get('country');
    this.options.url = this.options.url.concat(
                                              country.latitude 
                                              + "&lon=" + country.longitude 
                                              + "&units=" + this.unit 
                                              + "&appid=" + this.apiKey);
    let result = await this.httpService.get(this.options);
    result.status == 200 ? this.fetchWeatherData(result.data, country.capital)  
                         : this.getResultStatusAndCapital(result.status, country.capital);
  }

  fetchWeatherData(result: any, capital: string){
    this.capital = capital;
    let todayWeather = {
      icon: this.iconBaseUrl + result.weather[0].icon + "@2x.png",
      description: result.weather[0].description,
      temperature: result.main.temp,
    }
    this.weather = todayWeather;
  }

  getResultStatusAndCapital(status: number, capital: string){
    this.resultStatus = status;
    this.capital = capital;
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
    this.options.url = this.forecastBaseUrl 
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
          throw new Error('Invalid temperature description. Use "metric", "imperial", or "standard".');
    }
  }
  
}
