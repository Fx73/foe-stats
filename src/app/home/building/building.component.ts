import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BuildingDTO } from 'src/app/shared/DTO/buildingDTO';

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


  getBuildingColor(building: BuildingDTO): string {
    const lastchar = building.name.trim().charAt(building.name.trim().length - 1).toLowerCase();
    switch (lastchar) {
      case '+':
        return 'warning';
      case '*':
        return 'danger';
      default:
        return 'secondary'
    }
  }


}
