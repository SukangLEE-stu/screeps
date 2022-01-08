import { assert } from "console";

export function draftInit(){
    for(const name in Game.rooms){
        let room:Room = Game.rooms[name];
        if(room.controller && room.controller.my){
            let spawns:StructureSpawn[] = room.find(FIND_MY_SPAWNS);
            if(spawns.length){
                room.memory.draftSpawn = spawns[0].id;
                room.memory.draftCreepNum = 0;
            }
        }
    }
}

export function draftLivingFunction(){
  deleteNotExist();

  creepWork();

  spawnWork();

  generatePixel();
}

function generatePixel(){
    try{
        if(Game.cpu.bucket == 10000) {
            Game.cpu.generatePixel();
        }
    }catch(e){
        //console.log(e);
    }
}

function creepWork(){
    for(const name in Memory.creeps){
        let creep : Creep = Game.creeps[name];
        if(!creep.memory.draftFull && !creep.memory.working){
            if(!creep.memory.draftSource){
                let sources = creep.room.find(FIND_SOURCES);
                if(sources.length){
                    creep.memory.draftSource = sources[Game.time% (sources.length)].id;
                }
            }

            let id :string|undefined = creep.memory.draftSource;
            if(id){
                let src : Source|null = Game.getObjectById(id);
                if(src){
                    harvest(creep,src);
                }
            }

            if(creep.store.getFreeCapacity()==0){
                creep.memory.draftFull = true;
                creep.memory.working = true;
            }
        }
        if(creep.memory.working){

                //assert creep.room.memory.draftSpawn;
                let spawn : StructureSpawn|null = Game.getObjectById(creep.room.memory.draftSpawn);
                if(spawn && spawn.store[RESOURCE_ENERGY]<200){
                    transport(creep,spawn);
                }else{
                    let controller = creep.room.controller;

                    if(controller){
                        upgrade(creep,controller);
                    }
                }

                if(creep.store[RESOURCE_ENERGY]==0){
                    creep.memory.working = false;
                    creep.memory.draftFull = false;
                }

        }
    }

}

const creepNum = 5;

function spawnWork(){
    for(let name in Game.rooms){
        let room:Room = Game.rooms[name];
        if(room.controller&&room.controller.my){
            if(room.memory.draftCreepNum<creepNum){
                let spawn:StructureSpawn|null = Game.getObjectById(room.memory.draftSpawn);
                if(spawn && !spawn.spawning){
                    if(spawn.store[RESOURCE_ENERGY]>=250){
                        spawn.spawnCreep([MOVE,MOVE,CARRY,WORK],"worker"+Game.time,{
                            memory:{
                                role:"worker",
                                room:room.name,
                                createBeforeDeath:12,
                                working:false,
                                draftFull:false,
                                task:new CreepTask()
                            }
                        });
                        room.memory.draftCreepNum +=1;
                    }
                }
            }
        }
    }

}

function harvest(creep:Creep,source:Source){
    if(creep.harvest(source) == ERR_NOT_IN_RANGE){
        creep.moveTo(source);
    }
}

function transport(creep:Creep,spawn:StructureSpawn){
    if(creep.transfer(spawn,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        creep.moveTo(spawn);
    }
}

function upgrade(creep:Creep,controller:StructureController){
    if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
        creep.moveTo(controller);
    }
}

function deleteNotExist(){
// Automatically delete memory of missing creeps
for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
        Game.rooms[Memory.creeps[name].room].memory.draftCreepNum-=1;
      delete Memory.creeps[name];
    }
  }
}
