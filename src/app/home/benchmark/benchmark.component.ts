import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
export class BenchmarkComponent implements OnInit {

  benchmark: BenchmarkDTO;

  @Output()
  benchmarkEvent: EventEmitter<BenchmarkDTO> = new EventEmitter<BenchmarkDTO>()

  constructor() {
    let benchmarkjson = localStorage.getItem('benchmark')
    this.benchmark = benchmarkjson ? JSON.parse(benchmarkjson) : new BenchmarkDTO()
    this.benchmarkEvent.emit(this.benchmark)
  }

  ngOnInit(): void {
    this.benchmarkEvent.emit(this.benchmark)
  }
  saveBenchmark() {
    localStorage.setItem('benchmark', JSON.stringify(this.benchmark))
    this.benchmarkEvent.emit(this.benchmark)
  }
}
