
class CreepTask{
    //id is the only key
    public id:string;

    /**
     * work
     */
    public work(creep:Creep) :boolean {
        return true;
    }

    constructor(id:string){
        this.id = id;
    }

}
