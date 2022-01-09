import { initRoomMemory, roomFresh } from "./roomMemory";

export function myLoop(){
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
}
