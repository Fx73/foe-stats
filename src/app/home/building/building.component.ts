import { Component, Input, OnInit } from '@angular/core';

import { BuildingDTO } from 'src/app/shared/DTO/buildingDTO';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BuildingComponent {

  @Input()
  building: BuildingDTO = new BuildingDTO("")

  constructor() { }



}
