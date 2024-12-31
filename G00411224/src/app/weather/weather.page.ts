import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class WeatherPage implements OnInit {

  unit!: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.getUnit();
    if(this.unit.length == 0){
      console.log("nie ma unit w storage");
    }
  }

  async getUnit(){
    this.unit = await this.dataService.get('unit');
  }

  async setUnit(){
    this.dataService.set("unit", "metric");
  }
}
