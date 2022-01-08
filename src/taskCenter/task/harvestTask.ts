

class harvestTask extends Task{
    private sourceId:string;
    //private targetPos:RoomPosition;

    constructor(id:string,type:TaskType,priority:number,needCreep:number , srcId:string){
        super(id,type,priority,needCreep);
        this.sourceId = srcId;
        //this.targetPos = pos;
    }

    /**
     * work
     */
    public work(creep:Creep) :boolean {
        let source :Source|null = Game.getObjectById(this.sourceId);
        if(source){
            if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }
        return true;
    }

}
