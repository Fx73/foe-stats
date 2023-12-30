export class FiltersDTO {
  sortBy: SortingEnum = SortingEnum.Alphabetical
}

export enum SortingEnum {
  Alphabetical = "Alphabetical",
  Efficiency = "Efficiency"
}
