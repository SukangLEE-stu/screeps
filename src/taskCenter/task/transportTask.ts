/**
 * 要考虑无法传输进去amount或者无法取出amount怎么办
 */

enum TransportMethod{
    WITHDRAW,
    PICKUP,
    TRANSFER
}

class transportTask extends Task{
    private fromId:string;
    private fromPos:RoomPosition;
    private fromMethod:TransportMethod;

    private targetId:string;
    private targetPos:RoomPosition;
    private targetMethod:TransportMethod;

    private sourceType:string;
    private amount:number;

    constructor(id:string,type:TaskType,priority:number,needCreep:number ,
        fromId:string, fromPos:RoomPosition, fromMethod:TransportMethod,
        tarID:string, tarPos:RoomPosition, targetMetgod:TransportMethod,
        srctype:string,amount:number){
        super(id,type,priority,needCreep);
        this.fromId = fromId;
        this.fromPos = fromPos;
        this.fromMethod = fromMethod;
        this.targetId = tarID;
        this.targetPos = tarPos;
        this.targetMethod = targetMetgod;
        this.sourceType = srctype;
        this.amount = amount;
    }

    /**
     * available
     */
    public available(): boolean {
        return this.amount > 0;
    }
}
