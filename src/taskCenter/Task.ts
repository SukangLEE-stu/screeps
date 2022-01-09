import { CreepInfo } from "creepWork/CreepInfo";
import { TaskType } from "./TaskType";

export class Task{
    //id is only key
    public id:string;

    private taskType:TaskType;
    public priority:number;

    private needCreep:number;
    private allocatedCreep:number;
    public creepDict:{[name:string]:CreepInfo};

    //no need to continue
    private workDone:boolean;

    //has creep doing this task
    private working:boolean;


    /**
     * needed
     */
    public needed():boolean {
        return this.allocatedCreep < this.needCreep;
    }

    /**
     * allocateCreep
     */
    public allocateCreep(name:string,info:CreepInfo) :boolean {
        /*
        if(!Task.matchWork(creep,this.taskType)){
            return false;
        }*/

        this.allocatedCreep += 1;
        this.creepDict[name] = info;
        /**
         * need to add memory to creep?
         */
        return true;
    }

    /**
     * deleteCreep
     */
    public deleteCreep(creepName:string) : boolean {
        this.allocatedCreep -= 1;
        delete this.creepDict[creepName];
        return true;
    }

    /**
     * finished
     */
    public available():boolean {
        return true;
    }

    /**
     * work
     */
    public work(creep:Creep) :boolean {
        return true;
    }

    /**
     *
     * @param creep
     * @param type
     * @returns
     */
    private static matchWork(creep:Creep,type:TaskType):boolean{
        return true;
    }

    constructor(id:string,type:TaskType,priority:number,needCreep:number){
        this.id = id;
        this.taskType = type;
        this.priority = priority;
        this.needCreep = needCreep;
        this.allocatedCreep = 0;
        this.creepDict = {};
        this.workDone = false;
        this.working = false;
    }
}
