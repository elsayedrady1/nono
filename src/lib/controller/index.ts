import { IController } from "./types";

export class BaseController {
    path: string;

    constructor (options?: IController) {
         if(options) { 
            this.path = options.path
         }
    }
} 
