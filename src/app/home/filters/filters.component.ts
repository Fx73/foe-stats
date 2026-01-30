import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FiltersDTO, SortingEnum } from 'src/app/shared/DTO/filtersDTO';

import { BuildingType } from 'src/app/shared/DTO/buildingDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FiltersComponent implements OnInit {
  sortingEnum = Object.keys(SortingEnum).filter(item => isNaN(Number(item)));
  typeEnum = Object.values(BuildingType);

  filters: FiltersDTO;

  @Output()
  filtersEvent: EventEmitter<FiltersDTO> = new EventEmitter();

  constructor() {
    const json = localStorage.getItem('filters');
    this.filters = json ? JSON.parse(json) : new FiltersDTO();
  }

  ngOnInit(): void {
    this.filtersEvent.emit(this.filters);
  }

  sortChange(ev: any) {
    this.filters.sortBy = SortingEnum[ev.target.value as keyof typeof SortingEnum];
    this.save();
  }

  typesChange(ev: any) {
    this.filters.types = ev.detail.value;
    this.save();
  }


  save() {
    localStorage.setItem('filters', JSON.stringify(this.filters));
    this.filtersEvent.emit(this.filters);
  }
}
