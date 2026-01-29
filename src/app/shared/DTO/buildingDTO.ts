import { jsonIgnore } from 'json-ignore';

export class BuildingDTO {
  type: BuildingType;
  name: string = "";
  image: string = "";
  size: number = 1;
  chain: string | undefined;
  population: number | undefined;
  gold: number | undefined;
  supplies: number | undefined;
  resources: number | undefined;
  happiness: number | undefined;
  medal: number | undefined;
  forgepoint: number | undefined;
  attackAttacker: number | undefined;
  attackAttackerGBG: number | undefined;
  attackAttackerGEX: number | undefined;
  defenseAttacker: number | undefined;
  defenseAttackerGBG: number | undefined;
  defenseAttackerGEX: number | undefined;
  attackDefender: number | undefined;
  attackDefenderGBG: number | undefined;
  attackDefenderGEX: number | undefined;
  defenseDefender: number | undefined;
  defenseDefenderGBG: number | undefined;
  defenseDefenderGEX: number | undefined;
  percentageGold: number | undefined;
  percentageSupplies: number | undefined;
  guildResource: number | undefined;
  diamond: number | undefined;
  blueprint: number | undefined;
  military: number | undefined;

  @jsonIgnore()
  efficiency: BuildingEfficiency | undefined;

  constructor(name: string, type: BuildingType = BuildingType.Standard) {
    this.name = name
    this.type = type
  }

  mapProperty(name: string, value: number) {
    switch (name) {
      case "population":
        this.population = value
        break;
      case "money":
        this.gold = value
        break;
      case "supplies":
        this.supplies = value
        break;
      case "random_good_of_age":
      case "goods":
      case "all_goods_of_age":
        this.resources = value
        break;
      case "happiness":
      case "happiness_amount":
        this.happiness = value
        break;
      case "medals":
        this.medal = value
        break;
      case "strategy_points":
        this.forgepoint = value
        break;
      case "att_boost_attacker":
        this.attackAttacker = value
        break;
      case "def_boost_attacker":
        this.defenseAttacker = value
        break;
      case "att_boost_defender":
        this.attackDefender = value
        break;
      case "def_boost_defender":
        this.defenseDefender = value
        break;
      case "coin_production":
        this.percentageGold = value
        break;
      case "supply_production":
        this.percentageSupplies = value
        break;
      case "icon_great_building_bonus_guild_goods":
        this.guildResource = value
        break;
      case "premium":
        this.diamond = value
        break;
      case "blueprint":
        this.blueprint = value
        break;
      case "military":
        this.blueprint = value
        break;
      case "att_def_boost_attacker":
        this.attackAttacker = value
        this.defenseAttacker = value
        break;
      case "att_def_boost_defender":
        this.attackDefender = value
        this.defenseDefender = value
        break;
      case "rank":
      case "clan_power":
        break;
      default:
        console.log("Property not found on " + this.name + " : " + name)
        break;
    }
  }

  changeToUnitary() {
    if (this.gold)
      this.gold /= this.size
    if (this.supplies)
      this.supplies /= this.size
    if (this.population)
      this.population /= this.size
    if (this.happiness)
      this.happiness /= this.size
    if (this.resources)
      this.resources /= this.size
    if (this.forgepoint)
      this.forgepoint /= this.size
    if (this.medal)
      this.medal /= this.size
    if (this.attackAttacker)
      this.attackAttacker /= this.size
    if (this.attackAttackerGBG)
      this.attackAttackerGBG /= this.size
    if (this.attackAttackerGEX)
      this.attackAttackerGEX /= this.size
    if (this.defenseAttacker)
      this.defenseAttacker /= this.size
    if (this.defenseAttackerGBG)
      this.defenseAttackerGBG /= this.size
    if (this.defenseAttackerGEX)
      this.defenseAttackerGEX /= this.size
    if (this.attackDefender)
      this.attackDefender /= this.size
    if (this.attackDefenderGBG)
      this.attackDefenderGBG /= this.size
    if (this.attackDefenderGEX)
      this.attackDefenderGEX /= this.size
    if (this.defenseDefender)
      this.defenseDefender /= this.size
    if (this.defenseDefenderGBG)
      this.defenseDefenderGBG /= this.size
    if (this.defenseDefenderGEX)
      this.defenseDefenderGEX /= this.size
    if (this.percentageGold)
      this.percentageGold /= this.size
    if (this.percentageSupplies)
      this.percentageSupplies /= this.size
    if (this.guildResource)
      this.guildResource /= this.size
    if (this.diamond)
      this.diamond /= this.size
    if (this.blueprint)
      this.blueprint /= this.size
    if (this.military)
      this.military /= this.size
  }
}


export enum BuildingType {
  Standard = "Standard",
  GM = "Great Buildings",
  Special = "Special",
  Event = "Event"
}

export class BuildingEfficiency {
  global = 0
  population: number | undefined;
  gold: number | undefined;
  supplies: number | undefined;
  resources: number | undefined;
  happiness: number | undefined;
  medal: number | undefined;
  forgepoint: number | undefined;
  attackAttacker: number | undefined;
  attackAttackerGBG: number | undefined;
  attackAttackerGEX: number | undefined;
  defenseAttacker: number | undefined;
  defenseAttackerGBG: number | undefined;
  defenseAttackerGEX: number | undefined;
  attackDefender: number | undefined;
  attackDefenderGBG: number | undefined;
  attackDefenderGEX: number | undefined;
  defenseDefender: number | undefined;
  defenseDefenderGBG: number | undefined;
  defenseDefenderGEX: number | undefined;
  percentageGold: number | undefined;
  percentageSupplies: number | undefined;
  guildResource: number | undefined;
  diamond: number | undefined;
  blueprint: number | undefined;
  military: number | undefined;

  isPartial = false;
}
