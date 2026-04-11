import { Component, OnInit } from '@angular/core';
import { BenchmarkDTO, UnitaryBenchmarks } from '../shared/DTO/benchmarkDTO';
import { BuildingDTO, BuildingEfficiency } from '../shared/DTO/buildingDTO';
import { FiltersDTO, SortingEnum } from '../shared/DTO/filtersDTO';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from "../shared/header/header.component";
import { WikiaService } from './../services/wikia.service';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { BuildingComponent } from "./building/building.component";
import { FiltersComponent } from "./filters/filters.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, RouterModule, CommonModule, BenchmarkComponent, BuildingComponent, FiltersComponent]
})
export class HomePage implements OnInit {
  benchmark: BenchmarkDTO = new BenchmarkDTO()
  filters: FiltersDTO = new FiltersDTO()
  buildings: Array<BuildingDTO> = new Array()
  queryBuilding: Array<BuildingDTO> = new Array()

  query: string = ""

  constructor(private wikiaService: WikiaService) {
    this.wikiaService.buildingsObservable$.subscribe((buildingsList: BuildingDTO[]) => {
      if (buildingsList && buildingsList.length > 0) {
        this.buildings = buildingsList
        console.log("Buildings loaded: ", this.buildings);
        localStorage.setItem("buildings", JSON.stringify(this.buildings));

        this.computeEfficiency()
        this.queryList()
      } else {
        this.buildings = new Array()
        localStorage.removeItem("buildings")
      }
    });

  }

  ngOnInit(): void {
    let jsonBuildings = localStorage.getItem("buildings")
    if (jsonBuildings)
      this.buildings = JSON.parse(jsonBuildings)
  }

  initQuery(event: any) {
    this.query = event.target.value.toLowerCase()
    this.queryList()
  }

  queryList() {
    if (this.filters.types && this.filters.types.length > 0) {
      this.queryBuilding = this.buildings.filter(b =>
        this.filters.types.includes(b.type)
      );
    }

    this.queryBuilding = this.queryBuilding.filter(b =>
      b.name.toLowerCase().includes(this.query.toLowerCase())
    );

    switch (this.filters.sortBy) {
      case SortingEnum.Alphabetical:
        this.queryBuilding = this.queryBuilding.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case SortingEnum.Efficiency:
        this.queryBuilding = this.queryBuilding.sort((a, b) =>
          (b.efficiency?.global ?? 0) - (a.efficiency?.global ?? 0)
        );
        break;

      default:
        break;
    }

    console.log("Query: ", this.queryBuilding);
  }


  refreshBenchmark(benchmark: BenchmarkDTO) {
    this.benchmark = benchmark;
    this.computeEfficiency()
  }
  refreshFilters(filters: FiltersDTO) {
    this.filters = filters;
    this.queryList()
  }


  computeEfficiency() {
    const keys = Object.keys(new BenchmarkDTO()) as (keyof BenchmarkDTO)[];

    this.buildings.forEach(building => {
      building.efficiency = new BuildingEfficiency();
      for (const key of keys) {
        const value = building[key];
        if (!value) continue;

        const unitary = UnitaryBenchmarks[key as keyof UnitaryBenchmarks];
        const bench = this.benchmark[key as keyof BenchmarkDTO];

        const score = (value / unitary) * bench * 100;

        building.efficiency[key as keyof BuildingEfficiency] = score;
        building.efficiency.global += score;
      }
    });
  }


}
