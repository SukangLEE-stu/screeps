
class spawnTask extends Task{
    public name:string;
    private body:BodyPartConstant[];
    private cost:number;
    private creepMemory:CreepMemory;
    private spawnId:string;
    private processed:boolean;
    constructor(id:string,type:TaskType,priority:number,
        name:string,body:BodyPartConstant[],cost:number,mem:CreepMemory, spawnId:string){
        super(id,type,priority,0);
        this.name = name;
        this.body = body;
        this.cost = cost;
        this.creepMemory = mem;
        this.spawnId = id;
        this.processed = false;
    }

    public spawnWork(){
        let spawn:StructureSpawn|null = Game.getObjectById(this.spawnId);
        if(!spawn){
            console.log("ERR, no spawn!");
            try{
                Game.notify("ERR, no spawn! In creating "+this.name+"!");
            }catch(e){
                console.log(e);
            }
            return;
        }
        if(!spawn.spawning && spawn.store[RESOURCE_ENERGY]>=this.cost){
            spawn.spawnCreep(this.body,this.name,{
                memory:this.creepMemory
            });
            this.processed = true;
        }
    }

    public available(): boolean {
        return !this.processed;
    }
}
