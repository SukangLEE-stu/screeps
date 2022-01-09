
import { CreepRole } from "creepWork/CreepRole";
import { Task } from "taskCenter/Task";
import { harvestTask } from "taskCenter/task/harvestTask";
import { spawnTask } from "taskCenter/task/spawnTask";
import { upgradeTask } from "taskCenter/task/upgradeTask";
import { TaskCenter } from "taskCenter/TaskCenter";
import { TaskType } from "taskCenter/TaskType";
import { RareEnergyMemory } from "./source/RareEnergyMemory";
import { SourceEnergyMemory } from "./source/SourceEnergyMemory";
import { storedSource } from "./source/sources";

const constCreepNumber:needCreepType = {
    drone:2,
    worker:3,
    transport:3
  }
/**
 * 日常监测有无新房间归我
 */
export function roomFresh(room:Room){
    if(!room.memory.myInit && room.controller && room.controller.my){
        room.memory.myInit = true;

        room.memory.neededCreeps =constCreepNumber;
        //let taskCenter :TaskCenter = new TaskCenter(room.name,room.name);

        let spawnId:string = "";
        for(let name in Game.spawns){
            if(Game.spawns[name].room.name == room.name){
                spawnId = Game.spawns[name].id;
            }
        }

        let tasks : spawnTask[] = initialCreepTask(room,spawnId);

        global.center[room.name].spawnTasks = tasks;

        for(let name in Game.creeps){
            let creep:Creep = Game.creeps[name];
            if(creep.memory.room == room.name){
                global.center[room.name].addCreep(creep);
            }
        }

        let upgrade = new upgradeTask(room.controller.id,TaskType.UPGRADE,10,1,room.controller.id,1000000);

        global.center[room.name].workerTasks.push(upgrade);

        //挂载到global.center中，然后记得更新下面的center
        //global.center[room.name] = taskCenter;
    }
}

export function initRoomMemory(room:Room){
    if(!room.memory.initialed){
        room.memory.initialed = true;

        room.memory.sources = new storedSource();

        global.center[room.name] = new TaskCenter(room.name,room.name);

        let mine = room.find(FIND_MINERALS);
        let rareMine = room.find(FIND_DEPOSITS);
        for(let i = 0;i<mine.length;++i){
            let source:SourceEnergyMemory = new SourceEnergyMemory(mine[i].pos,mine[i].density,false,false);
            room.memory.sources.energy.push(source);
            let tt:Task = new harvestTask(mine[i].id,TaskType.HARVEST,5,1,mine[i].id);
            //assert this center is available
            global.center[room.name].harvestTasks.push(tt);
        }
        if(rareMine.length){
            let rareSource : RareEnergyMemory = new RareEnergyMemory(rareMine[0].pos,
                rareMine[0].depositType,
                false,
                false
            );
            room.memory.sources.rareSource = rareSource;
        }
    }

}

function initialCreepTask(room:Room,spawnId:string):spawnTask[]{
    let need:needCreepType = room.memory.neededCreeps;
    let tasks:spawnTask[] = [];

    /*
    spawnId 在新的房间中好像不能先造spawn
    */

    for(let i = 0;i<need["drone"];++i){
        tasks.push(
            new spawnTask('drone'+i,TaskType.SPAWN,2,'drone'+i,[MOVE,MOVE,CARRY,WORK],250,{
                role:CreepRole.DRONE,
                room:room.name,
                createBeforeDeath:12,
                working:false
            },spawnId)
        );
    }

    for(let i = 0;i<need["transport"];++i){
        tasks.push(
            new spawnTask('transport'+i,TaskType.SPAWN,7,'transport'+i,[MOVE,MOVE,CARRY,CARRY],200,{
                role:CreepRole.TRANSPORT,
                room:room.name,
                createBeforeDeath:12,
                working:false
            },spawnId)
        );
    }

    for(let i = 0;i<need["worker"];++i){
        tasks.push(
            new spawnTask('work'+i,TaskType.SPAWN,10,'work'+i,[MOVE,MOVE,CARRY,CARRY,WORK],300,{
                role:CreepRole.WORK,
                room:room.name,
                createBeforeDeath:15,
                working:false
            },spawnId)
        );
    }

    return tasks;

}
