
import { spawn } from "child_process";
import { initial } from "lodash";

const constCreepNumber:needCreepType = {
    drone:2,
    worker:3,
    transport:3
  }

export function roomFresh(room:Room){
    let structures : Structure[] = room.find(FIND_MY_STRUCTURES);

    let mem : centersMemory = {
            spawns:[]

    }

    for(let i = 0;i<structures.length;++i){
        switch(structures[i].structureType){
            case STRUCTURE_SPAWN:
                mem.spawns.push(structures[i].id);
                break;
        }
    }
    room.memory.centers = mem;
}

export function initRoomMemory(room:Room){
    if(!room.memory.initialed){
        room.memory.initialed = true;

        if(room.controller && room.controller.my){

            room.memory.neededCreeps =constCreepNumber;
            room.memory.taskCenter = new TaskCenter(room.name,room.name+Game.time);

            let spawnId:string = "";
            for(let name in Game.spawns){
                if(Game.spawns[name].room.name == room.name){
                    spawnId = Game.spawns[name].id;
                }
            }

            let tasks : spawnTask[] = initialCreepTask(room,spawnId);

            room.memory.taskCenter.spawnTasks = tasks;

            for(let name in Game.creeps){
                let creep:Creep = Game.creeps[name];
                if(creep.memory.room == room.name){
                    room.memory.taskCenter.addCreep(creep);
                }
            }

            let upgrade = new upgradeTask(room.controller.id,TaskType.UPGRADE,10,1,room.controller.id,1000000);

            room.memory.taskCenter.workerTasks.push(upgrade);

            roomFresh(room);

        }

        let mine = room.find(FIND_MINERALS);
        let rareMine = room.find(FIND_DEPOSITS);
        for(let i = 0;i<mine.length;++i){
            let source:SourceEnergyMemory = {
                pos:mine[i].pos,
                amount:mine[i].density,
                hasContainer:false,
                hasContainerFlag:false
            }
            room.memory.sources.energy.push(source);
            let tt:Task = new harvestTask(mine[i].id,TaskType.HARVEST,5,1,mine[i].id);
            room.memory.taskCenter.harvestTasks.push(tt);
        }
        if(rareMine.length){
            let rareSource : RareEnergyMemory = {
                pos:rareMine[0].pos,
                type:rareMine[0].depositType,
                hasContainerFlag:false,
                hasContainer:false
            }
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
