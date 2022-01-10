import { TaskCenter } from "taskCenter/TaskCenter";
import { TaskType } from "taskCenter/TaskType";
import { initRoomMemory, roomFresh } from "./roomMemory";

export function myLoop(){

    while(global.creepSign.length && global.creepSign[0].time == Game.time){
        global.center[global.creepSign[0].roomName].addCreep(
            global.creepSign[0].creepName,
            global.creepSign[0].creepRole
        );
        global.creepSign.splice(0,1);
    }

    TaskCenter.updateCreeps();

    for(let name in Game.rooms){
        let room:Room = Game.rooms[name];

        if(!global.center[name]){
            initRoomMemory(Game.rooms[name]);
        }

        roomFresh(Game.rooms[name]);

        if(room.controller&&room.controller.my){
            global.center[room.name].schedule();
        }
    }

    TaskCenter.unLock();
}
