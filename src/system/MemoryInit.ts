import { getEnergyTask } from "creepWork/work/getEnergyTask";
import { initRoomMemory } from "./roomMemory";
import { TaskCenter } from "taskCenter/TaskCenter";

export function memoryInit(){
    global.center = {};
    global.getEnergyTask = {};
    global.tasks = {};
    global.locks = {};
    global.creepSign = [];

    for(let name in Memory.creeps){
        delete Memory.creeps[name].task;
    }
    for(let name in Memory.flags){
        delete Memory.flags[name];
    }
    for(let name in Memory.rooms){
        delete Memory.rooms[name];
    }

    for(let name in Game.rooms){
        let room:Room = Game.rooms[name];
        initRoomMemory(room);
        for(let name in Game.creeps){
            let creep:Creep = Game.creeps[name];
            if(creep.memory.room == room.name){
                //这句又没有import到，佛了
                global.center[room.name].addCreep(creep.name,creep.memory.role);
            }
        }

    }


}
