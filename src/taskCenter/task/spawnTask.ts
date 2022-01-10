import { creepSign } from "system/creepSign";
import { Task } from "taskCenter/Task";
import { TaskType } from "taskCenter/TaskType";

export class spawnTask extends Task{
    public name:string;
    private body:BodyPartConstant[];
    private cost:number;
    public creepMemory:CreepMemory;
    private spawnId:string;
    private processed:boolean;
    constructor(id:string,type:TaskType,priority:number,
        name:string,body:BodyPartConstant[],cost:number,mem:CreepMemory, spawnId:string){
        super(id,type,priority,0);
        this.name = name;
        this.body = body;
        this.cost = cost;
        this.creepMemory = mem;
        this.spawnId = spawnId;
        this.processed = false;
    }

    public spawnWork() :boolean{
        let spawn:StructureSpawn|null = Game.getObjectById(this.spawnId);
        if(!spawn){
            console.log("ERR, no spawn!");
            try{
                Game.notify("ERR, no spawn! In creating "+this.name+"!");
            }catch(e){
                console.log(e);
            }
            return false;
        }
        if(global.locks[this.spawnId]){
            return false;
        }
        if(!spawn.spawning && spawn.store[RESOURCE_ENERGY]>=this.cost){
            spawn.spawnCreep(this.body,this.name,{
                memory:this.creepMemory
            });
            this.processed = true;
            global.locks[this.spawnId] = true;
            global.creepSign.push(new creepSign(
                Game.time+this.creepMemory.createBeforeDeath,
                this.creepMemory.role,
                this.name,
                spawn.room.name
            ));
            return true;
        }
        return false;
    }

    public available(): boolean {
        return !this.processed;
    }
}
