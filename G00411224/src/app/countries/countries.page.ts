import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonItem, IonCol, IonInput, IonAlert } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';
import { Router } from '@angular/router';

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
  countries!: any[];
  options: HttpOptions = {
    url: "https://restcountries.com/v3.1/name/"
  }

  constructor(private dataService: DataService, private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.getKeyWord();
  }

  async getKeyWord(){
    this.keyWord = await this.dataService.get('keyWord');
    this.options.url = this.options.url.concat(this.keyWord);
    let result = await this.httpService.get(this.options);
    this.countries = (result.status == 200) ? result.data : (this.resultStatus = result.status);
    console.log(this.countries);
  }

  async openNewsPage(countryCCA2: string, countryName: string){
    this.dataService.set("countryCCA2", countryCCA2);
    this.dataService.set("countryName", countryName);
    this.router.navigate(['/news']);
  }

  openWeatherPage(lat: number, lon: number, capital: string){
    this.dataService.set("latitude", lat);
    this.dataService.set("longitude", lon);
    this.dataService.set("capital", capital);
    this.router.navigate(['/weather']);
  }
}
