import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonItem, IonCol, IonInput, IonAlert } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';
import { Router } from '@angular/router';
import { Country } from 'src/model/country';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
  standalone: true,
  imports: [IonCol, IonItem, IonButton, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class CountriesPage implements OnInit {
  
  resultStatus!: number;        // Variable store the HTTP status code for the API response
  keyWord: string = "";         // Variable to store the keyWord for searching countries
  countries!: Country[];        // Variable of type Country array to hold country data
  options: HttpOptions = {
    url: "https://restcountries.com/v3.1/name/"
  }

  // Constructor injecting the required services for this class: DataService, HttpService, Router, ToastrService
  constructor(private dataService: DataService, 
              private httpService: HttpService,  
              private router: Router, 
              private toastr: ToastrService) { }

  // Initial method call on page load to call the getPageContent() method
  ngOnInit() {
    this.getPageContent();
  }

  /* Method to get all required data to start up the page:
  * -> get the keyWord value from storage
  * -> sets the this.keyWord variable value
  * -> makes the Http request 
  * -> if response status is 200 (ok), the fetchCountriesData(result) method is called
  * -> otherwise, getErrorDetails(result) method is called
  */
  async getPageContent(){
    let keyWord = await this.dataService.get('keyWord');
    this.keyWord = keyWord;
    this.options.url = this.options.url.concat(keyWord);
    let result = await this.httpService.get(this.options);
    result.status == 200 ? this.fetchCountriesData(result)  
                         : this.getErrorDetails(result);
  }

  /* Method to fetch all the data from API response:
  * -> initializes the countries array
  * -> maps api response data into the countries array to store data
  * -> calls the method displayInfo() on successful execution
  */
  fetchCountriesData(result: any){
    this.countries = [];
    result.data.forEach((element: any) => {
        let countryDetails = {
          flag: element.flags.png,
          cca2: element.cca2,
          officialName: element.name.official,
          capital: element.capital[0],
          latitude: element.latlng[0],
          longitude: element.latlng[1]
        }
        this.countries.push(countryDetails);
    });
    this.displayInfo();;
  }

  // Method to trigger the toastr service display message depending on countries array size
  displayInfo(){
    this.countries.length > 1 ? this.toastr.success('Countries loaded successfully')
                              : this.toastr.success('Country loaded successfully')
  }

  // Method to trigger the toastr service display message on response with an error status
  getErrorDetails(result: any) {
    this.resultStatus = result.data.status;
    let errorMessage = result.data.message;
    this.toastr.error('Request returned status code: ' + this.resultStatus + " " + errorMessage); 
  }

  /*
  * Method triggered by the user to open the news page
  * -> takes the specific country object as an argument and sets its value in dataService Storage
  * -> redirects to the news page
  */
  async openNewsPage(country: Country){
    await this.dataService.set("country", country);
    this.router.navigate(['/news']);
  }

  /*
  * Method triggered by the user to open the weather page
  * -> takes the specific country object as an argument and sets its value in dataService Storage
  * -> redirects to the weather page
  */
  async openWeatherPage(country: Country){
   await this.dataService.set('country', country);
   this.router.navigate(['/weather']);
  }

}
