import { Component, OnInit } from '@angular/core';

import { BenchmarkComponent } from './benchmark/benchmark.component';
import { BenchmarkDTO } from '../shared/DTO/benchmarkDTO';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, RouterModule, CommonModule, BenchmarkComponent]
})
export class HomePage {
  benchmark: BenchmarkDTO = new BenchmarkDTO();

  constructor() {

  }




}
