import { getStorage, ref } from "firebase/storage";

export class ImageOperations{
    storage;
    storageRef;

    constructor(){
        this.storage = getStorage();
        this.storageRef = ref(this.storage , )
    }
}
