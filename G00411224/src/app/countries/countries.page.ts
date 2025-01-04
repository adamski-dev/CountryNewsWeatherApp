import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonItem, IonCol, IonInput, IonAlert } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';
import { Router } from '@angular/router';
import { Country } from 'src/model/country';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
  standalone: true,
  imports: [IonCol, IonItem, IonButton, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CountriesPage implements OnInit {

  resultStatus!: number;
  keyWord: string = "";
  countries!: Country[];
  options: HttpOptions = {
    url: "https://restcountries.com/v3.1/name/"
  }

  constructor(private dataService: DataService, private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.getPageContent();
  }

  async getPageContent(){
    let keyWord = await this.dataService.get('keyWord');
    this.options.url = this.options.url.concat(keyWord);
    let result = await this.httpService.get(this.options);
    result.status == 200 ? this.fetchCountriesData(result, keyWord)  
                         : this.getResultStatusAndKeyWord(result.status, keyWord);
  }

  fetchCountriesData(result: any, keyWord: string){
    this.keyWord = keyWord;
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
  }

  getResultStatusAndKeyWord(status: number, keyWord: string){
    this.resultStatus = status;
    this.keyWord = keyWord;
  }

  async openNewsPage(country: Country){
    await this.dataService.set("country", country);
    this.router.navigate(['/news']);
  }

 async openWeatherPage(country: Country){
  await this.dataService.set('country', country);
  this.router.navigate(['/weather']);
 }

}
