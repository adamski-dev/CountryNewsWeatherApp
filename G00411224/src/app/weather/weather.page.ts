import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle} from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';
import { Weather } from 'src/model/weather';
import { ForecastComponent } from "../forecast/forecast.component";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ForecastComponent]
})
export class WeatherPage implements OnInit {

  weather!: Weather;
  unit!: string;
  capital!: string;
  iconBaseUrl = "https://openweathermap.org/img/wn/";
  apiKey = "50284dfe68111c3202262caf235e7ead";
  resultStatus!: number;
  weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat="
  options: HttpOptions = {
        url: "",
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
    let country = await this.dataService.get('country');
    this.options.url = this.weatherUrl
                        + country.latitude 
                        + "&lon=" + country.longitude 
                        + "&units=" + this.unit 
                        + "&appid=" + this.apiKey;
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

  ionViewDidLeave(){
    this.clearStorage();
  }

  async clearStorage(){
    await this.dataService.remove('country');
  }
}
