
class TaskCenter{
    private tasks:Task[];

    private roomName:string;

    private memoryKey:string;

    constructor(name:string,key:string){
        this.roomName = name;
        this.memoryKey = key;
        this.tasks = [];
    }
}
class Task{
    private id:string;
    constructor(id:string){
        this.id = id;
    }
}
