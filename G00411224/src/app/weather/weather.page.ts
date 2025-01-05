import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle} from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpOptions } from '@capacitor/core';
import { HttpService } from '../services/http.service';
import { Weather } from 'src/model/weather';
import { ForecastComponent } from "../forecast/forecast.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ForecastComponent]
})

export class WeatherPage implements OnInit {

  // Variable to store the weather data as a Weather object type
  weather!: Weather;
  
  // Variable to store the unit of temperature retrieved from / set in the dataService Storage
  unit!: string;
  
  // Variable to store the capital value for the particular Country passed as an argument 
  capital!: string;
  
  // Base url to load the icon to be displayed as an openweathermap icon
  iconBaseUrl = "https://openweathermap.org/img/wn/";
  
  // Api key to access the openweathermap API 
  apiKey = "50284dfe68111c3202262caf235e7ead";
  
  // Variable to store the resultStatus of http get response
  resultStatus!: number;
  
  // Base url for fetching the current weather data from openweathermap API
  weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat="
  
  // HttpOptions object to store the options values passed with an http get request
  options: HttpOptions = {
        url: "",
  }

  // Constructor injecting the serives required: DataService, HttpService, ToastrService
  constructor(private dataService: DataService, 
              private httpService: HttpService,
              private toastr: ToastrService) { }

  /*
  * Angular lifecycle Hook method calling the 
  * -> getUnit() method to retrieve the temperature unit from Storage or to set its default value 
  * -> getPageContent() method on component load to get all page content data
  */  
  ngOnInit() {
    this.getUnit();
    this.getPageContent();
  }

  /* Method checkt if the 'unit' value is already stored in the Storage
  * -> if the unit is not present, setDefaultUnit() method is called
  * -> otherwise, this.unit variable is set to that which was already stored
  */
  async getUnit(){
    await this.dataService.get('unit').then(data =>{
      if(!data){
        this.setDefaultUnit();
      }else {
        this.unit = data;
      }
    });
  }

  // Method sets the default unit value in the Storage as 'metric'
  async setDefaultUnit(){
    this.unit = "metric";
    await this.dataService.set("unit", this.unit);
  }

  /* Method getPageContent() to get data to start up the page:
  * -> get the country Object value from storage
  * -> sets the this.capital variable value
  * -> makes the Http request 
  * -> if response status is 200 (ok), the fetchWeatherData(result) method is called
  * -> otherwise, getErrorDetails(result) method is called
  */
  async getPageContent(){
    let country = await this.dataService.get('country');
    this.capital = country.capital;
    this.options.url = this.weatherUrl
                        + country.latitude 
                        + "&lon=" + country.longitude 
                        + "&units=" + this.unit 
                        + "&appid=" + this.apiKey;
    let result = await this.httpService.get(this.options);
    result.status == 200 ? this.fetchWeatherData(result.data)  
                         : this.getErrorDetails(result);
  }

  /* Method to fetch all the data from API response:
    * -> maps api response data into the weather variable of type Weather object to store data
    * -> calls the method displayInfo() on successful execution
    */
  fetchWeatherData(result: any){
    let todayWeather = {
      icon: this.iconBaseUrl + result.weather[0].icon + "@2x.png",
      description: result.weather[0].description,
      temperature: result.main.temp,
    }
    this.weather = todayWeather;
    this.displayInfo();
  }

  // Method to trigger the toastr success message on weather load
  displayInfo(){
    this.toastr.success('Weather data loaded successfully');
  }

  // Method to trigger the toastr service error display message on response with an error status
  getErrorDetails(result: any){
    this.resultStatus = result.data.cod;
    let errorMessage = result.data.message;
    this.toastr.error('Request returned status code: ' + this.resultStatus + " " + errorMessage);
  }

  // Method to trigger the clearStorage() method on Ionic lifecycle hook just before page is destroyed
  ionViewDidLeave(){
    this.clearStorage();
  }

  // Method to remove the dataService country object from Storage
  async clearStorage(){
    await this.dataService.remove('country');
  }
}
