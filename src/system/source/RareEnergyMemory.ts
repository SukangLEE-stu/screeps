export class RareEnergyMemory{

    public pos:RoomPosition;
    //amount:number;
    public type:string;

    public hasContainerFlag:boolean;
    public containerFlag:Flag|undefined;
    public hasContainer:boolean;
    public containerId:string|undefined;

    constructor(pos:RoomPosition,type:string,hcf:boolean,hc:boolean){
        //this.containerFlag = null;
        //this.containerId = null;
        this.hasContainer = hc;
        this.pos = pos;
        this.type = type;
        this.hasContainerFlag = hcf;
    }


}
