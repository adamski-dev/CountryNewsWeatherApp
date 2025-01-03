import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonButton, IonCardSubtitle, IonCol, IonItem, IonImg } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonImg, IonItem, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewsPage implements OnInit {

    resultStatus!: number;
    apiKey = "pub_638369bdc1a34699248a32cd65d0a5b49e2ae";  
    country!: string;
    newsData!: any[];
    options: HttpOptions = {
      url: "https://newsdata.io/api/1/latest?apikey=" + this.apiKey + "&country=",
    }
  
    constructor(private dataService: DataService, private httpService: HttpService) { }
  
    ngOnInit() {
      this.getCountryName();
      this.getPageContent();
    }
  
    async getPageContent(){
      let CCA2 = await this.dataService.get('countryCCA2');
      this.options.url = this.options.url.concat(CCA2);
      let result = await this.httpService.get(this.options);
      this.newsData = (result.status == 200) ? result.data.results : (this.resultStatus = result.status);
      console.log(this.newsData);
    }

    async getCountryName(){
      this.country = await this.dataService.get('countryName');
    }
}
