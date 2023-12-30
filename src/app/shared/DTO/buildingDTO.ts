export class BuildingDTO {
  type: BuildingType;
  name: string = "";
  image: string = "";
  size: number = 1;
  chain: string | undefined;
  pop: number | undefined;
  gold: number | undefined;
  supplies: number | undefined;
  resources: number | undefined;
  happiness: number | undefined;
  medals: number | undefined;
  forgepoint: number | undefined;
  attackAttacker: number | undefined;
  defenseAttacker: number | undefined;
  attackDefender: number | undefined;
  defenseDefender: number | undefined;
  percentageGold: number | undefined;
  percentageGoods: number | undefined;
  guildResource: number | undefined;
  diamonds: number | undefined;
  blueprint: number | undefined;
  units: number | undefined;

  efficienty: number = 0;

  constructor(name: string, type: BuildingType = BuildingType.Standard) {
    this.name = name
    this.type = type
  }

  mapProperty(name: string, value: number) {
    switch (name) {
      case "population":
        this.pop = value
        break;
      case "money":
        this.gold = value
        break;
      case "supplies":
        this.supplies = value
        break;
      case "random_good_of_age":
        this.resources = value
        break;
      case "happiness":
        this.happiness = value
        break;
      case "medals":
        this.medals = value
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
        this.percentageGoods = value
        break;
      case "icon_great_building_bonus_guild_goods":
        this.guildResource = value
        break;
      case "premium":
        this.diamonds = value
        break;
      case "blueprint":
        this.blueprint = value
        break;
      case "military":
        this.blueprint = value
        break;
    }
  }
}

export enum BuildingType {
  Standard,
  GM,
  Special,
  Event
}
