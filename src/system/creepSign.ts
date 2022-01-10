import { CreepRole } from "creepWork/CreepRole";

export class creepSign{
    public time:number;
    public creepName:string;
    public creepRole:CreepRole;
    public roomName:string;

    constructor(t:number,r:CreepRole,cn:string,rn:string){
        this.time = t;
        this.creepName = cn;
        this.roomName = rn;
        this.creepRole = r;
    }
}
