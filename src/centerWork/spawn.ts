/**
export function spawnWork(spawn:StructureSpawn){
    if(spawn.spawning){
        return;
    }
    let tasks = spawn.room.memory.taskCenter.spawnTasks;
    for(let i = 0;i<tasks.length;++i){
        if(spawn.store[RESOURCE_ENERGY] >= tasks[i].cost){
            spawn.spawnCreep(tasks[i].body,tasks[i].name,{
                memory:tasks[i].creepMemory
            })
            spawn.room.memory.taskCenter.spawnTasks.splice(i,1);
            return;
        }
    }
}

export function calculate(body:BodyPartConstant[]):number{
    let sum = 0;
    for(let i = 0;i<body.length;++i){
        sum += BODYPART_COST[body[i]];
    }
    return sum;
}
*/
