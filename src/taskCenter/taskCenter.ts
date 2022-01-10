/**
 * 调度中心：基于Creeps名单的任务调度
 *
 * 更多想法：这个中心可以直接放在内存中，不用和特定房间绑定
 *
 * 实践：这个中心只能放到运行内存中，不能存储到memory中
 */

import { CreepInfo } from "creepWork/CreepInfo";
import { CreepRole } from "creepWork/CreepRole";
import { CreepTask } from "creepWork/CreepTask";
import { Task } from "./Task";
import { spawnTask } from "./task/spawnTask";
import { TransportMethod, transportTask } from "./task/transportTask";
import { TaskType } from "./TaskType";


class TaskCenter{
    public creepDict:{[name:string]:CreepInfo};

    public spawnTasks:spawnTask[];
    public harvestTasks:Task[];
    public transportTasks:Task[];
    public workerTasks:Task[];
    private roomName:string;

    private memoryKey:string;

    constructor(name:string,key:string){
        this.roomName = name;
        this.memoryKey = key;
        this.harvestTasks = [];
        this.transportTasks = [];
        this.workerTasks = [];
        this.spawnTasks = [];
        this.creepDict = {};
    }

    /**
     * schedule
     */
    public schedule() {

        this.scheduleCreeps();

        this.scheduleTasks();

        this.signTasks();

        //this.sortTasks();
    }

    /**
     * addCreep(新出生的)
     */
    public addCreep(name:string,role:CreepRole):boolean {
        this.creepDict[name] = new CreepInfo(role);
        return true;
    }

    /**
     * 更新去世的creep
     */
    public static updateCreeps() {
        //console.log('update begin!')
        for(let name in Memory.creeps){//我是牛马
            if(!Game.creeps[name]){
                TaskCenter.deleteCreep(name);
            }
        }
    }

    /**
     * 分配任务给creep
     */
    private scheduleCreeps() {
        for(let name in this.creepDict){
            this.allocateCreep(name);
        }
    }

    /**
     * 基于任务的creep工作和任务完成的删除
     */
    private scheduleTasks() {
        for(let i = 0;i<this.spawnTasks.length;){
            if(!this.scheduleSpawnTask(this.spawnTasks[i])){
                //this.taskCallback(this.spawnTasks[i]);
                this.spawnTasks.splice(i,1);
                continue;
            }
            ++i;
        }
        //this.unLock();

        for(let i = 0;i<this.harvestTasks.length;){
            if(!this.scheduleTask(this.harvestTasks[i])){
                this.taskCallback(this.harvestTasks[i]);
                this.harvestTasks.splice(i,1);
                continue;
            }
            ++i;
        }
        for(let i = 0;i<this.transportTasks.length;){
            if(!this.scheduleTask(this.transportTasks[i])){
                this.taskCallback(this.transportTasks[i]);
                this.transportTasks.splice(i,1);
                continue;
            }
            ++i;
        }
        for(let i = 0;i<this.workerTasks.length;){
            if(!this.scheduleTask(this.workerTasks[i])){
                this.taskCallback(this.workerTasks[i]);
                this.workerTasks.splice(i,1);
                continue;
            }
            ++i;
        }
    }

    /**
     * 建筑的任务发布(目前只有spawn)
     */
    private signTasks() {
        for(let name in Game.spawns){
            let spawn:StructureSpawn = Game.spawns[name];
            if(spawn.room.name == this.roomName){
                //!spawn.memory.signed
                if(Game.time % 10 == 0 && spawn.store[RESOURCE_ENERGY]<275){
                    let source : any;
                    let method : TransportMethod = TransportMethod.PICKUP;
                    //set src
                    if(!source){
                        let structure = spawn.pos.findClosestByRange(FIND_STRUCTURES,{
                            filter:function(obj):boolean{
                                return (obj.structureType == STRUCTURE_CONTAINER ||
                                    obj.structureType == STRUCTURE_STORAGE) &&
                                    obj.store[RESOURCE_ENERGY]>0;
                            }
                        });
                        if(structure){
                            source = structure;
                            method = TransportMethod.WITHDRAW;
                        }else{
                            let dropped = spawn.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                                filter:function(obj):boolean{
                                    return obj.resourceType == RESOURCE_ENERGY;
                                }
                            });
                            if(dropped){
                                source = dropped;
                                method = TransportMethod.PICKUP;
                            }
                        }
                    }
                    let taskId = spawn.room.name+'spawn'+Game.time;
                    let task:transportTask = new transportTask(taskId,TaskType.TRANSPORT,5,
                    1,source.id,source.pos,method,spawn.id,spawn.pos,TransportMethod.TRANSFER,RESOURCE_ENERGY,
                    spawn.store.getFreeCapacity(RESOURCE_ENERGY)-25);
                    //登记任务
                    global.tasks[taskId] = TaskType.TRANSPORT;
                    this.transportTasks.push(task);
                    console.log(spawn.name+" signed!");
                    spawn.memory.signed = true;
                }
            }
        }
    }

    /** */
    public static unLock() {
        global.locks = {};
    }

    /**
     * 如果任务已完成则返回false
     * @param task
     */
    private scheduleTask(task:Task):boolean{
        if(!task.available()){
            return false;
        }
        for(let name in task.creepDict){
            task.work(Game.creeps[name]);
        }
        return true;
    }

    private scheduleSpawnTask(task:spawnTask) :boolean{
        if(!task.available()){
            return false;
        }
        task.spawnWork();
        return true;
    }

    private taskCallback(task:Task) {
        delete global.tasks[task.id];

        for(let name in task.creepDict){
            this.creepDict[name] = task.creepDict[name];
        }
    }

    /**
     * 分配成功就删去任务中心中creep的条目
     * @param name
     * @returns
     */
    private allocateCreep(name:string):boolean{
        switch(this.creepDict[name].role){
            case CreepRole.DRONE:
                for(let i = 0;i<this.harvestTasks.length;++i){
                    if(this.harvestTasks[i].needed()){
                        this.harvestTasks[i].allocateCreep(name,this.creepDict[name]);
                        Game.creeps[name].memory.task = new CreepTask(this.harvestTasks[i].id);
                        delete this.creepDict[name];
                        return true;
                    }
                }
                break;

            case CreepRole.TRANSPORT:
                for(let i = 0;i<this.transportTasks.length;++i){
                    if(this.transportTasks[i].needed()){
                        this.transportTasks[i].allocateCreep(name,this.creepDict[name]);
                        Game.creeps[name].memory.task = new CreepTask(this.transportTasks[i].id);
                        delete this.creepDict[name];
                        return true;
                    }
                }
                break;

            case CreepRole.WORK:
                for(let i = 0;i<this.workerTasks.length;++i){
                    if(this.workerTasks[i].needed()){
                        this.workerTasks[i].allocateCreep(name,this.creepDict[name]);
                        Game.creeps[name].memory.task = new CreepTask(this.workerTasks[i].id);
                        delete this.creepDict[name];
                        return true;
                    }
                }
                break;

            default:break;
        }
        return false;
    }

    /**
     * 内存清理
     * @param creepName
     * @returns
     */
    public static deleteCreep(creepName:string) {
        //if at work, need to find place
        let creepMem = Memory.creeps[creepName];
        let roomName = null;
        let task = null;
        if(creepMem){
            task = creepMem.task;
            roomName = creepMem.room;
        }
        if(task){
            if(roomName){
                let type:TaskType = global.tasks[task.id];
                switch(type){
                    case TaskType.HARVEST:
                        for(let i = 0;i<global.center[roomName].harvestTasks.length;++i){
                            global.center[roomName].harvestTasks[i].deleteCreep(creepName);
                        }
                        break;
                    case TaskType.TRANSPORT:
                        for(let i = 0;i<global.center[roomName].transportTasks.length;++i){
                            global.center[roomName].transportTasks[i].deleteCreep(creepName);
                        }
                        break;
                    default:
                        for(let i = 0;i<global.center[roomName].workerTasks.length;++i){
                            global.center[roomName].workerTasks[i].deleteCreep(creepName);
                        }
                        break;
                }
            }
        }else{
            if(roomName){
                delete global.center[roomName].creepDict[creepName];
            }
        }
        console.log('delete creep memory ' + creepName)
        delete Memory.creeps[creepName];
        delete global.getEnergyTask[creepName];
        return true;
    }

}

export {TaskCenter};
