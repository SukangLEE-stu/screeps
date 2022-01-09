import { initRoomMemory } from "./roomMemory";

export function memoryInit(){
    global.center = {};

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
        initRoomMemory(Game.rooms[name]);
    }
}
