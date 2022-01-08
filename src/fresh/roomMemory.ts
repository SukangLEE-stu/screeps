import { calculate } from "centerWork/spawn";
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

            let tasks : spawnTask[] = initialCreepTask(room);

            room.memory.taskCenter = new TaskCenter(room.name,room.name+Game.time);

            room.memory.taskCenter.spawnTasks = tasks;

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

function initialCreepTask(room:Room):spawnTask[]{
    let need:needCreepType = room.memory.neededCreeps;
    let tasks:spawnTask[] = [];

    let droneTask:spawnTask = {
        name: "drone",
        body:[MOVE,MOVE,CARRY,WORK],
        cost:250,
        creepMemory:{
            role:"DRONE",
            room:room.name,
            createBeforeDeath:12,
            working:false,
            task:new getEnergyTask()
        }
    }
    for(let i = 0;i<need["drone"];++i){
        let t:spawnTask = droneTask;
        t.name = t.name+(i-10);
        tasks.push(t);
    }


    let carryTask:spawnTask = {
        name: "transport",
        body:[MOVE,MOVE,CARRY,CARRY],
        cost:200,
        creepMemory:{
            role:"TRANSPORT",
            room:room.name,
            createBeforeDeath:12,
            working:false,
            task:new getEnergyTask()
        }
    }

    for(let i = 0;i<need["transport"];++i){
        let t:spawnTask = carryTask;
        t.name = t.name+(i-10);
        tasks.push(t);
    }

    let workTask:spawnTask = {
        name: "work",
        body:[MOVE,MOVE,CARRY,CARRY,WORK],
        cost:300,
        creepMemory:{
            role:"WORK",
            room:room.name,
            createBeforeDeath:15,
            working:false,
            task:new getEnergyTask()
        }
    }

    for(let i = 0;i<need["worker"];++i){
        let t:spawnTask = workTask;
        t.name = t.name+(i-10);
        tasks.push(t);
    }

    return tasks;

}
