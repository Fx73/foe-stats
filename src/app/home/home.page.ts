import { BenchmarkDTO, UnitaryBenchmarks } from '../shared/DTO/benchmarkDTO';
import { BuildingDTO, BuildingEfficiency } from '../shared/DTO/buildingDTO';
import { Component, OnInit } from '@angular/core';
import { FiltersDTO, SortingEnum } from '../shared/DTO/filtersDTO';

import { BenchmarkComponent } from './benchmark/benchmark.component';
import { BuildingComponent } from "./building/building.component";
import { CommonModule } from '@angular/common';
import { FiltersComponent } from "./filters/filters.component";
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WikiaService } from './../services/wikia.service';

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
        buildingsList.forEach(b => b.changeToUnitary())
        this.buildings = this.buildings.concat(buildingsList)
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
    this.queryBuilding = this.buildings.filter((b) => b.name.toLowerCase().indexOf(this.query) > -1)
    switch (this.filters.sortBy) {
      case SortingEnum.Alphabetical:
        this.queryBuilding = this.queryBuilding.sort((a, b) => a.name < b.name ? -1 : 1)
        break;
      case SortingEnum.Efficiency:
        this.queryBuilding = this.queryBuilding.sort((a, b) => a.efficiency?.global! > b.efficiency?.global! ? -1 : 1)
        break;
      default:

    }
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
    this.buildings.forEach(b => {
      b.efficiency = new BuildingEfficiency()
      if (b.gold) {
        b.efficiency.gold = b.gold / UnitaryBenchmarks.gold * this.benchmark.gold * 100
        b.efficiency.global += b.efficiency.gold
      }
      if (b.supplies) {
        b.efficiency.supplies = b.supplies / UnitaryBenchmarks.supplies * this.benchmark.supplies * 100
        b.efficiency.global += b.efficiency.supplies
      }
      if (b.population) {
        b.efficiency.population = b.population / UnitaryBenchmarks.population * this.benchmark.population * 100
        b.efficiency.global += b.efficiency.population
      }
      if (b.happiness) {
        b.efficiency.happiness = b.happiness / UnitaryBenchmarks.happiness * this.benchmark.happiness * 100
        b.efficiency.global += b.efficiency.happiness
      }
      if (b.resources) {
        b.efficiency.resources = b.resources / UnitaryBenchmarks.resources * this.benchmark.resources * 100
        b.efficiency.global += b.efficiency.resources
      }
      if (b.forgepoint) {
        b.efficiency.forgepoint = b.forgepoint / UnitaryBenchmarks.forgepoint * this.benchmark.forgepoint * 100
        b.efficiency.global += b.efficiency.forgepoint
      }
      if (b.medal) {
        b.efficiency.medal = b.medal / UnitaryBenchmarks.medal * this.benchmark.medal * 100
        b.efficiency.global += b.efficiency.medal
      }
      if (b.attackAttacker) {
        b.efficiency.attackAttacker = b.attackAttacker / UnitaryBenchmarks.attackAttacker * this.benchmark.attackAttacker * 100
        b.efficiency.global += b.efficiency.attackAttacker
      }
      if (b.defenseAttacker) {
        b.efficiency.defenseAttacker = b.defenseAttacker / UnitaryBenchmarks.defenseAttacker * this.benchmark.defenseAttacker * 100
        b.efficiency.global += b.efficiency.defenseAttacker
      }
      if (b.attackDefender) {
        b.efficiency.attackDefender = b.attackDefender / UnitaryBenchmarks.attackDefender * this.benchmark.attackDefender * 100
        b.efficiency.global += b.efficiency.attackDefender
      }
      if (b.defenseDefender) {
        b.efficiency.defenseDefender = b.defenseDefender / UnitaryBenchmarks.defenseDefender * this.benchmark.defenseDefender * 100
        b.efficiency.global += b.efficiency.defenseDefender
      }
      if (b.percentageGold) {
        b.efficiency.percentageGold = b.percentageGold / UnitaryBenchmarks.percentageGold * this.benchmark.percentageGold * 100
        b.efficiency.global += b.efficiency.percentageGold
      }
      if (b.percentageSupplies) {
        b.efficiency.percentageSupplies = b.percentageSupplies / UnitaryBenchmarks.percentageSupplies * this.benchmark.percentageSupplies * 100
        b.efficiency.global += b.efficiency.percentageSupplies
      }
      if (b.guildResource) {
        b.efficiency.guildResource = b.guildResource / UnitaryBenchmarks.guildResource * this.benchmark.guildResource * 100
        b.efficiency.global += b.efficiency.guildResource
      }
      if (b.diamond) {
        b.efficiency.diamond = b.diamond / UnitaryBenchmarks.diamond * this.benchmark.diamond * 100
        b.efficiency.global += b.efficiency.diamond
      }
      if (b.blueprint) {
        b.efficiency.blueprint = b.blueprint / UnitaryBenchmarks.blueprint * this.benchmark.blueprint * 100
        b.efficiency.global += b.efficiency.blueprint
      }
      if (b.military) {
        b.efficiency.military = b.military / UnitaryBenchmarks.military * this.benchmark.military * 100
        b.efficiency.global += b.efficiency.military
      }
    })
  }

}
