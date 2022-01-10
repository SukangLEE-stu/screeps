/**
 * 要考虑无法传输进去amount或者无法取出amount怎么办
 */

import { Task } from "taskCenter/Task";
import { TaskType } from "taskCenter/TaskType";

export enum TransportMethod{
    WITHDRAW,
    PICKUP,
    TRANSFER
}

export class transportTask extends Task{
    private fromId:string;
    private fromPos:RoomPosition;
    private fromMethod:TransportMethod;

    private targetId:string;
    private targetPos:RoomPosition;
    private targetMethod:TransportMethod;

    private sourceType:ResourceConstant;
    private amount:number;

    private fromExist:boolean;

    constructor(id:string,type:TaskType,priority:number,needCreep:number ,
        fromId:string, fromPos:RoomPosition, fromMethod:TransportMethod,
        tarID:string, tarPos:RoomPosition, targetMetgod:TransportMethod,
        srctype:ResourceConstant,amount:number){
        super(id,type,priority,needCreep);
        this.fromId = fromId;
        this.fromPos = fromPos;
        this.fromMethod = fromMethod;
        this.targetId = tarID;
        this.targetPos = tarPos;
        this.targetMethod = targetMetgod;
        this.sourceType = srctype;
        this.amount = amount;
        this.fromExist = true;
    }

    /**
     * available
     */
    public available(): boolean {
        return this.fromExist && this.amount > 0 ;
    }

    public work(creep: Creep): boolean {
        if(!creep){
            return false;
        }
        if(!creep.memory.transportGET){
            let obj:any = Game.getObjectById(this.fromId);
            if(!obj){
                this.fromExist = false;
                return false;
            }
            switch(this.fromMethod){
                case TransportMethod.PICKUP:
                    if(creep.pickup(obj) == ERR_NOT_IN_RANGE){
                        creep.moveTo(obj);
                    }else{
                        creep.memory.transportGET = true;
                    }
                    break;
                case TransportMethod.WITHDRAW:
                    if(creep.withdraw(obj,this.sourceType,this.amount) == ERR_NOT_IN_RANGE){
                        creep.moveTo(obj);
                    }else{
                        creep.memory.transportGET = true;
                    }
                    break;
                default:break;
            }
        }else{
            let obj:any = Game.getObjectById(this.targetId);
            if(!obj){
                this.fromExist = false;
                return false;
            }
            let t:number = creep.store[this.sourceType];
            switch(this.targetMethod){
                case TransportMethod.TRANSFER:

                    if(creep.transfer(obj,this.sourceType,t) == ERR_NOT_IN_RANGE){
                        creep.moveTo(obj);
                    }else{
                        this.amount -= t;
                        creep.memory.transportGET = false;
                    }
                    break;
                default:break;
            }
        }
        return true;
    }
}
