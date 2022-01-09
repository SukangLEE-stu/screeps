/**
 * 调度中心：基于Creeps名单的任务调度
 *
 * 更多想法：这个中心可以直接放在内存中，不用和特定房间绑定
 */


class TaskCenter{
    public creepDict:{[name:string]:CreepInfo};

    public spawnTasks:spawnTask[];
    public harvestTasks:Task[];
    private transportTasks:Task[];
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
        this.updateCreeps();

        this.scheduleCreeps();

        this.scheduleTasks();

        this.signTasks();

        //this.sortTasks();
    }

    /**
     * addCreep(新出生的)
     */
    public addCreep(creep:Creep):boolean {
        this.creepDict[creep.name] = new CreepInfo(creep.memory.role);
        return true;
    }

    /**
     * 更新去世的creep
     */
    private updateCreeps() {
        for(let name in this.creepDict){
            if(!Game.creeps[name]){
                this.unbind(name);

                this.deleteCreep(name);
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
                this.workerTasks.splice(i,1);
                continue;
            }
            ++i;
        }

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
                if(!spawn.memory.signed && spawn.store[RESOURCE_ENERGY]<275){
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
                    let task:transportTask = new transportTask('spawn'+Game.time,TaskType.TRANSPORT,5,
                    1,source.id,source.pos,method,spawn.id,spawn.pos,TransportMethod.TRANSFER,RESOURCE_ENERGY,
                    spawn.store.getFreeCapacity(RESOURCE_ENERGY)-25);

                    this.transportTasks.push(task);
                    console.log(spawn.name+" signed!");
                    spawn.memory.signed = true;
                }
            }
        }
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
                    this.transportTasks[i].allocateCreep(name,this.creepDict[name]);
                    Game.creeps[name].memory.task = new CreepTask(this.transportTasks[i].id);
                    delete this.creepDict[name];
                    return true;
                }
                break;

            case CreepRole.WORK:
                for(let i = 0;i<this.workerTasks.length;++i){
                    this.workerTasks[i].allocateCreep(name,this.creepDict[name]);
                    Game.creeps[name].memory.task = new CreepTask(this.workerTasks[i].id);
                    delete this.creepDict[name];
                    return true;
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
    private deleteCreep(creepName:string) {
        delete this.creepDict[creepName];
        delete Memory.creeps[creepName];
        return true;
    }

    /**
     * 解绑creep和对应任务
     * @param creepName
     * @returns
     */
    private unbind(creepName:string) {
        if(!Memory.creeps[creepName].task){
            return;
        }
        switch(this.creepDict[creepName].role){
            case CreepRole.DRONE:
                for(let i = 0;i<this.harvestTasks.length;++i){
                    this.harvestTasks[i].deleteCreep(creepName);
                }
                break;
            case CreepRole.TRANSPORT:
                for(let i = 0;i<this.transportTasks.length;++i){
                    this.transportTasks[i].deleteCreep(creepName);
                }
                break;
            case CreepRole.WORK:
                for(let i = 0;i<this.workerTasks.length;++i){
                    this.workerTasks[i].deleteCreep(creepName);
                }
                break;
            default:break;
        }
    }


}


