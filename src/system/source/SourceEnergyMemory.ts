export class SourceEnergyMemory{
  pos:RoomPosition;
  amount:number;

  hasContainerFlag:boolean;
  containerFlag:Flag|undefined;
  hasContainer:boolean;
  containerId:string|undefined;

  constructor(pos:RoomPosition,am:number,hcf:boolean,hc:boolean){
    this.hasContainer = hc;
    this.hasContainerFlag = hcf;
    this.amount = am;
    this.pos = pos;
    //this.containerId = null;
    //this.containerFlag = null;
  }

}
