import { Task } from "taskCenter/Task";
import { TaskType } from "taskCenter/TaskType";
import { getEnergy } from "./subTask/getEnergy";

export class upgradeTask extends Task{
    private controllerId:string;
    //private sourceType:string;
    private amount:number;

    constructor(id:string,type:TaskType,priority:number,needCreep:number ,
        ctlId:string, amount:number){
        super(id,type,priority,needCreep);
        this.controllerId = ctlId;
        this.amount = amount;
    }

    /**
     * available
     */
    public available(): boolean {
        return this.amount > 0;
    }

    /**
     * work
     */
    public work(creep:Creep):boolean {
        if(!creep.memory.working){
            getEnergy(creep);
        }else{
            let ctl:StructureController|null = Game.getObjectById(this.controllerId);

            if(ctl){
                if(creep.upgradeController(ctl) == ERR_NOT_IN_RANGE){
                    creep.moveTo(ctl);
                }
            }

            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
        return true;
    }
}
