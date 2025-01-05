import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonCol, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCol, IonButton, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule],
})

export class HomePage  {

  // Property to store the keyword value entered by the user
  keyword: string = "";

  // Injecting DataService and Router in the constructor
  constructor(private dataService: DataService, private router: Router) {
  }

  /*
  * Method to navigate to the countries page after keyword value is set by the user
  * -> First, the key keyWord with its value is set in the dataService Storage
  * -> Next, navigating to the countries page
  */ 
  async openCountriesPage(){
    await this.dataService.set("keyWord", this.keyword);
    this.router.navigate(['/countries']);
  }

  // Method to navigate to the settings page
  openSettingsPage(){
    this.router.navigate(['/settings']);
  }
}
