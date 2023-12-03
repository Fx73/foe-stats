import { Component, OnInit } from '@angular/core';

import { BenchmarkDTO } from 'src/app/shared/DTO/benchmarkDTO';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class BenchmarkComponent {

  benchmark: BenchmarkDTO;

  constructor() {
    let benchmarkjson = localStorage.getItem('benchmark');
    this.benchmark = benchmarkjson ? JSON.parse(benchmarkjson) : new BenchmarkDTO();

  }

  saveBenchmark() {
    localStorage.setItem('benchmark', JSON.stringify(this.benchmark));

  }
}
