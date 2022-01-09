import { RareEnergyMemory } from "./RareEnergyMemory";
import { SourceEnergyMemory } from "./SourceEnergyMemory";

export class storedSource{

    public energy:SourceEnergyMemory[];
    public rareSource:RareEnergyMemory;//deposit
    constructor(){
        this.energy = [];
        this.rareSource = new RareEnergyMemory(new RoomPosition(0,0,'W0N0'),RESOURCE_EXTRACT,false,false);
    }
  }
