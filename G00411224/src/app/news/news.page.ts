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

    // Api key for accessing the news data API
    apiKey = "pub_638369bdc1a34699248a32cd65d0a5b49e2ae"; 

    // Variable to store the resultStatus of http resopnse
    resultStatus!: number;
    
    // Variable to store the official country name passed by the user with a Country object
    country!: string;

    // Variable to store all News data as a News type array of objects
    newsData!: News[];

    // Base URL to fetch the news data from newsdata.io API
    baseUrl = "https://newsdata.io/api/1/latest?apikey=" + this.apiKey + "&country=";

    // HttpOptions object to store the options values passed with an http get request
    options: HttpOptions = {
      url: "",
    }
  
    // Constructor injecting the serives required: DataService, HttpService, ToastrService
    constructor(private dataService: DataService, 
                private httpService: HttpService,
                private toastr: ToastrService) { }
    
    // Angular lifecycle Hook ethod calling the getPageContent() method on component load 
    ngOnInit() {
      this.getPageContent();
    }

  /* Method getPageContent() to get data to start up the page:
  * -> get the country Object value from storage
  * -> sets the this.country variable value
  * -> makes the Http request 
  * -> if response status is 200 (ok), the fetchNewsData(result) method is called
  * -> otherwise, getErrorDetails(result) method is called
  */
    async getPageContent(){
      let country = await this.dataService.get('country');
      this.country = country.officialName;
      this.options.url = this.baseUrl + country.cca2;
      let result = await this.httpService.get(this.options);
      result.status == 200 ? this.fetchNewsContent(result) 
                           : this.getErrorDetails(result);
    }

    /* Method to fetch all the data from API response:
    * -> initializes the newsData array
    * -> maps api response data into the newsData array of News objects to store data
    * -> calls the method displayInfo() on successful execution
    */
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

    // Method to trigger the toastr success message on news load
    displayInfo(){
      this.toastr.success('News data loaded successfully');
    }

    // Method to trigger the toastr service error display message on response with an error status
    getErrorDetails(result: any) {
      this.resultStatus = result.status;
      let errorMessage = result.data.results.message;
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
