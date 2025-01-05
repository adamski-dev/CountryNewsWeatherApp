import { Component, OnInit, Input } from '@angular/core';
import { IonButton, IonCard, IonCardSubtitle, IonImg, IonCardHeader, IonCardTitle } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { HttpOptions } from '@capacitor/core';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { Forecast } from 'src/model/forecast';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonCardSubtitle, IonImg, IonCard, IonCardHeader, IonCardTitle, CommonModule]
})

export class ForecastComponent  implements OnInit {

  // Variable to store the forecast data as a Forecast object array data type
  @Input() forecast!: Forecast[];

  // Variable to store the resultStatus of http get response
  resultStatus!: number;
  
  // Variable to store the unit of forecast temperature set depending on the 'unit' value stored in the Storage data service
  forecastUnit!: string;
  
  // Variable flag to trigger the Forecast component load initiated from the ionic button component
  forecastFlag!: boolean;
  
  // Variable to store the unit of temperature retrieved from the dataService Storage
  unit!: string;
  
  // Base url to load the icon to be displayed as an openweathermap icon
  iconBaseUrl = "https://openweathermap.org/img/wn/";
  
  // Api key to access the openweathermap API
  apiKey = "50284dfe68111c3202262caf235e7ead";
  
  // Base url for fetching the 5 days weather forecast data from openweathermap API
  forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
  
  // HttpOptions object to store the options values passed with an http get request
  options: HttpOptions = {
          url: "",
  }

  // Constructor injecting the serives required: DataService, HttpService, ToastrService
  constructor(private dataService: DataService, 
              private httpService: HttpService,
              private toastr: ToastrService) { }

  /*
  * Angular lifecycle Hook method
  */
  ngOnInit() {
  }

  /* Method triggered from the ionic button to load the forecast component data
  * -> sets / unsets the forecastFlag variable 
  * -> if forecastFlag is set (true), calls the getPageContent() method
  * -> if forecastFlag is unset (false), the forecast array is set to empty
  */
  viewForecast(){
    this.forecastFlag = !this.forecastFlag;
    if(this.forecastFlag){
      this.getPageContent();
    } else {
      this.forecast = [];
    }
  }

  /* Method getPageContent() to get data to start up the page:
  * -> awaits for the response from getForecastServicesData() method
  * -> if response status is 200 (ok), the fetchForecastData(result) method is called
  * -> otherwise, getErrorDetails(result) method is called
  */
  async getPageContent(){
    let result = await this.getForecastServicesData();
    result.status == 200 ? this.fetchForecastData(result)  
                         : this.getErrorDetails(result);
  };

  /* Method getForecastServicesData() to get data from all services:
  * -> get the temperatur unit value from storage
  * -> get the country object value from storage
  * -> makes the Http request 
  * -> returns the response from http get method
  */
  async getForecastServicesData(){
    this.unit = await this.dataService.get('unit');
    let country = await this.dataService.get('country');
    this.options.url = this.forecastUrl 
                      + country.latitude 
                      + "&lon=" + country.longitude 
                      + "&units=" + this.unit 
                      + "&appid=" + this.apiKey;
    return  await this.httpService.get(this.options); 
  }

  /* Method to fetch all the forecast data from API response:
    * -> maps api response data into the forecast array of Forecast type Objects to store data
    * -> calls the getForecastTempeUnit() method
    * -> calls the method displayInfo() on successful execution
    */
  fetchForecastData(result: any){
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
    this.displayInfo();
  }

  // Method to trigger the toastr success message on forecast load
  displayInfo(){
    this.toastr.success('Forecast data loaded successfully');
  }

  // Method to trigger the toastr service error display message on response with an error status
  getErrorDetails(result: any){
    this.resultStatus = result.data.cod;
    let errorMessage = result.data.message;
    this.toastr.error('Request returned status code: ' + this.resultStatus + " " + errorMessage);
  }

  // Method to calculate  and return a date for the particular day of forecast depending on index value passed as an argument
  getForecastDate(index: number): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + index);
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Method to set the forecastUnit of temperature depending on the value of 'unit' set earlier in the Storage
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
