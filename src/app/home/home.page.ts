import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';

import { BenchmarkComponent } from './benchmark/benchmark.component';
import { BenchmarkDTO } from '../shared/DTO/benchmarkDTO';
import { BuildingComponent } from "./building/building.component";
import { BuildingDTO } from '../shared/DTO/buildingDTO';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";
import { RouterModule } from '@angular/router';
import { WikiaService } from './../services/wikia.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, RouterModule, CommonModule, BenchmarkComponent, BuildingComponent]
})
export class HomePage implements OnInit {
  benchmark: BenchmarkDTO = new BenchmarkDTO()
  buildings: Array<BuildingDTO> = new Array()
  queryBuilding: Array<BuildingDTO> = new Array()

  constructor(private wikiaService: WikiaService) {
  }
  ngOnInit(): void {
    this.wikiaService.buildingsObservable$.subscribe(this.refreshList);

    let jsonBuildings = localStorage.getItem("buildings")
    if (jsonBuildings)
      this.buildings = JSON.parse(jsonBuildings)
    this.queryBuilding = this.buildings

  }

  initQuery() {
  }


  refreshList(buildingsList: BuildingDTO[]) {
    if (buildingsList && buildingsList.length > 0) {
      this.buildings = this.buildings.concat(buildingsList)
      localStorage.setItem("buildings", JSON.stringify(this.buildings));
    } else {
      this.buildings = new Array()
      localStorage.removeItem("buildings")
    }
  }

  refreshBenchmark(benchmark: BenchmarkDTO) {
    this.benchmark = benchmark;
  }

}
