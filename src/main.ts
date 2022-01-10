import { draftInit, draftLivingFunction } from "fastExist/draft";
import { memoryInit } from "system/MemoryInit";
import { Position } from "source-map";
import { ErrorMapper } from "utils/ErrorMapper";
import { myLoop } from "system/loop";
import { TaskCenter } from "taskCenter/TaskCenter";
import { CreepTask } from "creepWork/CreepTask";
import { CreepRole } from "creepWork/CreepRole";
import { storedSource } from "system/source/sources";
import { getEnergyTask } from "creepWork/work/getEnergyTask";
import { TaskType } from "taskCenter/TaskType";
import { creepSign } from "system/creepSign";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    draftFull?:boolean;
    draftSource?:string;

    transportGET?:boolean;

    role: CreepRole;
    room: string;
    createBeforeDeath:number;
    working: boolean;
    task?: CreepTask;
  }

  interface RoomMemory{
    draftCreepNum:number;
    draftSpawn:string;

    initialed:boolean;
    myInit:boolean;
    //taskCenter:TaskCenter;
    neededCreeps:needCreepType;
    sources:storedSource;
    centers:centersMemory;
  }

  interface centersMemory{
    spawns:string[];
  }

  interface needCreepType{
    drone:number;
    worker:number;
    transport:number;
  }

  interface SpawnMemory{
    signed:boolean;
  }


  /*
  interface TaskCenter{
    spawnTasks:spawnTask[];

  }*/


  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
      center:{[name:string]:TaskCenter}

      getEnergyTask:{[name:string]:getEnergyTask};

      tasks:{[id:string]:TaskType};

      locks:{[id:string]:boolean};

      creepSign:creepSign[];
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
memoryInit();
export const loop = ErrorMapper.wrapLoop(() => {
  //console.log(`Current game tick is ${Game.time}`);
  //draftLivingFunction();
  myLoop();
});
