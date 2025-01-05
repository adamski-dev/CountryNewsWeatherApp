import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonButton, IonCardSubtitle, IonCol, IonItem, IonImg } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { HttpOptions } from '@capacitor/core';
import { News } from 'src/model/news';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonImg, IonItem, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class NewsPage implements OnInit {

    apiKey = "pub_638369bdc1a34699248a32cd65d0a5b49e2ae";  
    resultStatus!: number; 
    country!: string;
    newsData!: News[];
    baseUrl = "https://newsdata.io/api/1/latest?apikey=" + this.apiKey + "&country=";
    options: HttpOptions = {
      url: "",
    }
  
    constructor(private dataService: DataService, 
                private httpService: HttpService,
                private toastr: ToastrService) { }
    
    ngOnInit() {
      this.getPageContent();
    }

    async getPageContent(){
      let country = await this.dataService.get('country');
      this.country = country.officialName;
      this.options.url = this.baseUrl + country.cca2;
      let result = await this.httpService.get(this.options);
      result.status == 200 ? this.fetchNewsContent(result) 
                           : this.getErrorDetails(result);
    }

    fetchNewsContent(result: any){
      this.newsData = [];
      result.data.results.forEach((element: any) => {
          let newsDetails = {
            image_url: element.image_url,
            title: element.title,
            link: element.link,
            description: element.description
          }
          this.newsData.push(newsDetails);
      });
      this.displayInfo();
    }

    displayInfo(){
      this.toastr.success('News data loaded successfully');
    }

    getErrorDetails(result: any) {
      this.resultStatus = result.status;
      let errorMessage = result.data.results.message;
      this.toastr.error('Request returned status code: ' + this.resultStatus + " " + errorMessage); 
    }

    ionViewDidLeave(){
      this.clearStorage();
    }

    async clearStorage(){
      await this.dataService.remove('country');
    }
}
