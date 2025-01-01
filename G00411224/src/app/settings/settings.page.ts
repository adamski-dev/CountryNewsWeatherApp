import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRadioGroup, IonRadio, IonCol, IonList, IonItem, IonGrid, IonRow, IonInput } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonInput, IonRow, IonGrid, IonItem, IonList, IonCol, IonRadio, IonRadioGroup, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {

  selected: string = "";

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getUnit();
  }

  async getUnit(){
    this.selected = await this.dataService.get('unit');
  }

  ionViewWillLeave(){
    this.setUnit();
  }

  async setUnit(){
    await this.dataService.set("unit", this.selected);
  }

}
