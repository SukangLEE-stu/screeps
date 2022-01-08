/**
 * 调度中心：基于Creeps名单的任务调度
 */
class TaskCenter{
    private harvestTasks:Task[];

    private roomName:string;

    private memoryKey:string;

    constructor(name:string,key:string){
        this.roomName = name;
        this.memoryKey = key;
        this.harvestTasks = [];
    }
}



