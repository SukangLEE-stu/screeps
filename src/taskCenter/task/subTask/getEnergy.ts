import { getEnergyTask } from "creepWork/work/getEnergyTask";

export function getEnergy(creep:Creep){
    //get energy
    if(!global.getEnergyTask[creep.name]){
        global.getEnergyTask[creep.name] = new getEnergyTask();
    }
        global.getEnergyTask[creep.name].work(creep);
}
