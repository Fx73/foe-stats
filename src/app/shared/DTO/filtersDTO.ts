import { BuildingType } from "./buildingDTO"

export class FiltersDTO {
  sortBy: SortingEnum = SortingEnum.Alphabetical
  types: BuildingType[] = Object.values(BuildingType)
}

export enum SortingEnum {
  Alphabetical = "Alphabetical",
  Efficiency = "Efficiency"
}
