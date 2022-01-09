import { CreepTask } from "creepWork/CreepTask";
import { TransportMethod } from "taskCenter/task/transportTask";

export class getEnergyTask extends CreepTask{
    private sourceId:string;
    private method:TransportMethod;

    constructor(){
        super('getEnergy'+Game.time);
        this.sourceId = "";
        this.method = TransportMethod.PICKUP;
    }

    public work(creep:Creep): boolean {
        let source : any = Game.getObjectById(this.sourceId);
        //set src
        if(!source){
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter:function(obj):boolean{
                    return (obj.structureType == STRUCTURE_CONTAINER ||
                        obj.structureType == STRUCTURE_STORAGE) &&
                        obj.store[RESOURCE_ENERGY]>0;
                }
            });
            if(structure){
                this.sourceId = structure.id;
                this.method = TransportMethod.WITHDRAW;
            }else{
                let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,{
                    filter:function(obj):boolean{
                        return obj.resourceType == RESOURCE_ENERGY;
                    }
                });
                if(dropped){
                    this.sourceId = dropped.id;
                    this.method = TransportMethod.PICKUP;
                }
            }

            source = Game.getObjectById(this.sourceId);
        }

        if(source){
            switch(this.method){
                case TransportMethod.PICKUP:
                    if(creep.pickup(source) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source);
                    }
                    break;
                case TransportMethod.WITHDRAW:
                    if(creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(source);
                    }
            }
        }

        if(creep.store.getFreeCapacity() == 0){
            creep.memory.working = true;
        }

        return true;
    }

}
