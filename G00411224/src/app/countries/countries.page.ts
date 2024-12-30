import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonItem, IonCol } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
  standalone: true,
  imports: [IonCol, IonItem, IonButton, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CountriesPage implements OnInit {

  keyWord: string = "";
  //countriesUrl = 'https://restcountries.com/v3.1/all';
  //countryUrl = 'https://restcountries.com/v3.1/name/';
  countriesInfo!: any;
  options: HttpOptions = {
    url: "https://restcountries.com/v3.1/name/"
  }

  constructor(private dataService: DataService, private httpService: HttpService) { }

  ngOnInit() {
    this.getKeyWord();
  }

  async getKeyWord(){
    this.keyWord = await this.dataService.get('keyWord');
    this.options.url = this.options.url.concat(this.keyWord);
    let result = await this.httpService.get(this.options);
    this.countriesInfo = result.data;
    console.log(JSON.stringify(this.countriesInfo));
  }
}
