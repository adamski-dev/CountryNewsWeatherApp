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
  imports: [IonImg, IonItem, IonCol, IonCardSubtitle, IonButton, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewsPage implements OnInit {

    country!: string;
    apiKey = "pub_638369bdc1a34699248a32cd65d0a5b49e2ae";
    countryCCA2: string = "";
    newsData!: any[];
    options: HttpOptions = {
      url: "https://newsdata.io/api/1/latest?apikey=" + this.apiKey + "&country=",
    }
  
    constructor(private dataService: DataService, private httpService: HttpService) { }
  
    ngOnInit() {
      this.getCCA2();
    }
  
    async getCCA2(){
      this.countryCCA2 = await this.dataService.get('countryCCA2');
      this.options.url = this.options.url.concat(this.countryCCA2);
      let result = await this.httpService.get(this.options);
      this.newsData = result.data.results;
      console.log(this.newsData);
    }

}
