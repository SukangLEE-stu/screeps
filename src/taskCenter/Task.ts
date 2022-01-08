
class Task{
    private id:string;
    private type:TaskType;
    private priority:number;

    private needCreep:number;
    private allocatedCreep:number;
    private creepList:{[key:string]:boolean};

    //no need to continue
    private workDone:boolean;


    /**
     * needed
     */
    public needed():boolean {
        return this.allocatedCreep < this.needCreep;
    }

    /**
     * allocateCreep
     */
    public allocateCreep(creep:Creep) :boolean {
        if(!this.matchWork(creep,this.type)){
            return false;
        }

        return true;
    }

    /**
     * deleteCreep
     */
    public deleteCreep(creepName:string) : boolean {
        this.allocatedCreep -= 1;
        delete this.creepList[creepName];
        return true;
    }

    /**
     * finished
     */
    public finished():boolean {
        return false;
    }

    /**
     *
     * @param creep
     * @param type
     * @returns
     */
    private matchWork(creep:Creep,type:TaskType):boolean{
        return true;
    }


    constructor(id:string,type:TaskType,priority:number,needCreep:number){
        this.id = id;
        this.type = type;
        this.priority = priority;
        this.needCreep = needCreep;
        this.allocatedCreep = 0;
        this.creepList = {};
        this.workDone = false;
    }
}
