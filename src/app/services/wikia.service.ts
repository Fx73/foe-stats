import * as cheerio from 'cheerio';

import { BehaviorSubject, Observable, Subject, finalize, forkJoin, lastValueFrom, map, switchMap } from 'rxjs';
import { BuildingDTO, BuildingType } from './../shared/DTO/buildingDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WikiaService {
  private siteUrl = 'https://en.wiki.forgeofempires.com/api.php'
  private actionUrl = '?action=parse&format=json&origin=*&page='

  private sheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1o93Xv8juozCKnU3N1BdoON6cDx7rSICgYwYWZggqT6k/values/UnitaryBuildings?key=AIzaSyCNyB_Wfkwn7Hdsij5AXvgFE5eIAWD23AU'

  private buildingsSubject: Subject<BuildingDTO[]> = new Subject<BuildingDTO[]>();
  buildingsObservable$ = this.buildingsSubject.asObservable();

  private fromWikia: Boolean = false;

  public isWorking() {
    return this.workers > 0
  };
  private workers = 0

  httpOptions = {
    headers: new HttpHeaders({ "Access-Control-Allow-Origin": "*" })
  };

  constructor(private http: HttpClient) { }


  async refreshBuildings(): Promise<any> {
    this.buildingsSubject.next([]);
    if (this.fromWikia) {
      this.getSpecialBuildingsFromWikia().subscribe(buildings => {
        buildings.forEach(b => b.changeToUnitary());
        this.buildingsSubject.next(buildings);
      });
    }
    else {
      this.getBuildingsFromSheet().subscribe(buildings => {
        this.buildingsSubject.next(buildings);
      });
    }

  }


  getBuildingsFromSheet(): Observable<BuildingDTO[]> {
    return this.http.get<any>(this.sheetUrl).pipe(
      map(response => {
        const rows = response.values;
        const headers = rows[0];

        return rows.slice(1).map((row: string[]) => {
          return this.mapRowToBuilding(headers, row);
        });
      })
    );
  }
  private mapRowToBuilding(headers: string[], row: string[]): BuildingDTO {
    const nameIndex = headers.indexOf("Name");
    const name = row[nameIndex] ?? "";

    const building = new BuildingDTO(name);

    headers.forEach((h, i) => {
      const key = this.normalizeHeader(h);
      const value = row[i];

      if (key && value !== undefined) {
        (building as any)[key] = this.parseValue(value);
      }
    });

    return building;
  }
  private normalizeHeader(h: string): string | null {
    if (!h) return null;
    return h
      .replace(/\s+/g, "")
      .replace(/^\w/, c => c.toLowerCase());
  }

  private parseValue(v: string): any {
    if (v === "" || v === null || v === undefined) return null;

    const normalized = v.replace(",", ".");

    if (!isNaN(Number(normalized))) return Number(normalized);

    // IMAGE("url")
    const match = v.match(/IMAGE\("([^"]+)"\)/i);
    if (match) return match[1];

    return v;
  }




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

  getSpecialBuildingsFromWikia(): Observable<BuildingDTO[]> {
    this.workers++;

    return this.http.get(this.siteUrl + this.actionUrl + "Special_Building_List").pipe(
      map(value => this.clearLeveledBuildings(this.jsonToList(value))),
      switchMap(buildings => {
        const observables = buildings.map(building =>
          this.http.get(this.siteUrl + this.actionUrl + building.url).pipe(
            map((bValue: any) =>
              this.jsonToBuilding(building.name, bValue.parse.text['*'], BuildingType.Special)
            )
          )
        );
        return forkJoin(observables);
      }),
      map(buildingsDTO => buildingsDTO.filter((b): b is BuildingDTO => b !== null)),
      finalize(() => this.workers--)
    );
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
    const spaceAgeMarsRow = table.find('tr').filter((_, el) => $(el).text().includes('Space Age Titan'));
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
