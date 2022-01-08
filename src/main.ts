import { draftInit, draftLivingFunction } from "fastExist/draft";
import { Position } from "source-map";
import { ErrorMapper } from "utils/ErrorMapper";

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

    role: string;
    room: string;
    createBeforeDeath:number;
    working: boolean;
  }

  interface RoomMemory{
    draftCreepNum:number;
    draftSpawn:string;

    initialed:boolean;
    taskCenter:TaskCenter;
    neededCreeps:needCreepType;
    sources:{
      energy:SourceEnergyMemory[];
      rareSource:RareEnergyMemory;//deposit
    }
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

  }

  interface TaskCenter{
    spawnTasks:spawnTask[];

  }

  interface spawnTask{
    name:string;
    body:BodyPartConstant[];
    cost:number;
    creepMemory:CreepMemory;
  }

  interface SourceEnergyMemory{
    pos:RoomPosition;
    amount:number;

    hasContainerFlag:boolean;
    containerFlag?:Flag;
    hasContainer:boolean;
    containerId?:string;

  }

  interface RareEnergyMemory{
    pos:RoomPosition;
    //amount:number;
    type:string;

    hasContainerFlag:boolean;
    containerFlag?:Flag;
    hasContainer:boolean;
    containerId?:string;

  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
draftInit();
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  draftLivingFunction();
});
