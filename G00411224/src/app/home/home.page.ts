import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonCol, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCol, IonItem, IonButton, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule],
})

export class HomePage {

  keyword: string = "";

  constructor(private dataService: DataService, private router: Router) {
    
  }

  async openCountriesPage(){
    this.dataService.set("keyWord", this.keyword);
    this.router.navigate(['/countries']);
  }

  openSettingsPage(){

  }
}
