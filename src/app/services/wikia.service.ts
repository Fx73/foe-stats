import * as cheerio from 'cheerio';

import { BehaviorSubject, Subject, forkJoin, lastValueFrom, map } from 'rxjs';
import { BuildingDTO, BuildingType } from './../shared/DTO/buildingDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WikiaService {
  private siteUrl = 'https://en.wiki.forgeofempires.com/api.php'
  private actionUrl = '?action=parse&format=json&origin=*&page='

  private buildingsSubject: Subject<BuildingDTO[]> = new Subject<BuildingDTO[]>();
  buildingsObservable$ = this.buildingsSubject.asObservable();

  public isWorking() {
    return this.workers > 0
  };
  private workers = 0

  httpOptions = {
    headers: new HttpHeaders({ "Access-Control-Allow-Origin": "*" })
  };

  constructor(private http: HttpClient) { }



  getBuildingTest() {
    console.log("test")
    this.http.get(this.siteUrl + this.actionUrl + "Iridescent_Garden").subscribe(
      (bValue: any) => {
        console.log(bValue)
        var a = this.jsonToBuilding("Iridescent_Garden", bValue.parse.text['*'], BuildingType.Special);
        a?.changeToUnitary()
        console.log(a)
      })

  }


  async refreshBuildings(): Promise<any> {
    this.buildingsSubject.next([]);
    //this.getGreatBuildings()
    this.getSpecialBuildings()

  }


  getGreatBuildings() {
    try {
      this.workers += 1
      this.http.get(this.siteUrl + this.actionUrl + "Great_Building_List").subscribe((value) => {
        let buildings = this.jsonToList(value);
        const observables = buildings.map(building => {
          return this.http.get(this.siteUrl + this.actionUrl + building.url).pipe(
            map((bValue: any) => {
              return this.jsonToBuilding(building.name, bValue.parse.text['*'], BuildingType.GM);
            })
          );
        });

        forkJoin(observables).subscribe((buildingsDTO) => {
          this.buildingsSubject.next(buildingsDTO.filter(b => b).map(b => b!));
          this.workers -= 1
        });
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la page :', error);
      this.workers -= 1
    }
  }

  getSpecialBuildings() {
    try {
      this.workers += 1
      this.http.get(this.siteUrl + this.actionUrl + "Special_Building_List").subscribe((value) => {
        let buildings = this.jsonToList(value);
        buildings = this.clearLeveledBuildings(buildings)
        const observables = buildings.map(building => {
          return this.http.get(this.siteUrl + this.actionUrl + building.url).pipe(
            map((bValue: any) => {
              return this.jsonToBuilding(building.name, bValue.parse.text['*'], BuildingType.Special);
            })
          );
        });

        forkJoin(observables).subscribe((buildingsDTO) => {
          this.buildingsSubject.next(buildingsDTO.filter(b => b).map(b => b!));
          this.workers -= 1
        });
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la page :', error);
      this.workers -= 1
    }
  }

  clearLeveledBuildings(buildings: Array<BuildingInfo>): Array<BuildingInfo> {
    const finalBuildings = new Array<BuildingInfo>();
    const leveledBuildings = new Map<string, BuildingInfo>();
    const levelBuildings = new Map<string, number>();

    buildings.forEach(building => {
      const splitName = building.name.split(" - Lv. ");
      if (splitName.length > 1) {
        const level = parseInt(splitName[1]);
        if ((levelBuildings.get(splitName[0]) ?? 0) < level) {
          leveledBuildings.set(splitName[0], building)
          levelBuildings.set(splitName[0], level)
        }
      } else {
        finalBuildings.push(building)
      }
    });

    return finalBuildings.concat(Array.from(leveledBuildings.values()))
  }

  jsonToBuilding(name: string, jsonData: any, type: BuildingType): BuildingDTO | null {
    const building: BuildingDTO = new BuildingDTO(name, type)
    console.log(name)

    const $ = cheerio.load(jsonData);
    let table = $('table');

    if (table.text().includes('upgrades this building to'))
      return null

    // Extraction des informations
    building.image = table.find('tr').first().find('td img').attr('src') ?? "";

    table.find('tr').each((_: any, row: any) => {
      const columns = $(row).find('td');
      if (columns.length === 2) {
        const label = columns.eq(0).text().trim().replace(':', '');
        let value: any = columns.eq(1).text().trim();
        if (label === 'Size') {
          building.size = value.split('x').map(Number).reduce((a: number, b: number) => a * b)
        } else if (label === 'Chain') {
          building.chain = columns.eq(1).find('a').text().trim();
        }
      }
    });

    // Extraction des en-têtes de colonne
    table = $('table').eq(2);
    const columnHeaders: string[] = [""];
    table.find('tr').first().next().find('th').each((_, el) => {
      const headerText = $(el).find('img').first().attr("alt")?.trim().split("-")[0] ?? "";
      columnHeaders.push(headerText);
    });
    console.log(columnHeaders)

    // Extraction des données pour Space Age Mars
    const spaceAgeMarsRow = table.find('tr').filter((_, el) => $(el).text().includes('Space Age Mars'));
    if (!spaceAgeMarsRow.length) {
      return null;
    }

    const values: number[] = [];
    spaceAgeMarsRow.next().find('td').each((_, el) => {
      const value = parseInt($(el).text().trim().replace(/,/g, ''));
      values.push(value);
    });

    // Mapping des valeurs extraites aux propriétés du DTO
    columnHeaders.forEach((columnName, index) => {
      if (columnName)
        building.mapProperty(columnName.toLowerCase(), values[index])
    });
    console.log(building)
    return building as BuildingDTO
  }

  jsonToList(jsonData: any): Array<BuildingInfo> {
    const specialBuildingList = jsonData?.parse?.text?.['*'];
    const buildingsInfo: BuildingInfo[] = [];

    if (specialBuildingList) {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(specialBuildingList, 'text/html');
      const buildingRows = htmlDocument.querySelectorAll('tr');

      buildingRows.forEach(row => {
        const buildingData = {
          name: row.querySelector('a')?.textContent || '',
          url: (row.querySelector('a')?.getAttribute('href') || '').replace('/index.php?title=', '')
        };
        if (buildingData.name != '')
          buildingsInfo.push(buildingData);
      });

    }
    return buildingsInfo
  }

}

class BuildingInfo {
  name: string = "";
  url: string = "";
}
