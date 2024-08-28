// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-literate/types.d.ts' */;
/** @import {EnhancementInfo} from './ts-refs/trans-render/be/types.d.ts' */

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class BeLiterate extends BE {
    /**
     * @type {AbortController | undefined}
     */
    #abortController
    /**
     * 
     * @param {Event} e 
     */
    handleEvent(e) {
        const self = 
        /** @type {AP & BEAllProps} */
        /** @type {any} */
        (this);
        this.#readFile(self);
    }
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement, any>}
     */
    static config = {

    }

    /**
     * 
     * @param {Element} enhancedElement 
     * @param {EnhancementInfo} enhancementInfo
     * @override 
     */
    async attach(enhancedElement, enhancementInfo){
        await super.attach(enhancedElement, enhancementInfo);
        this.#abortController = new AbortController()
        enhancedElement.addEventListener('change', this, {signal: this.#abortController.signal});
    }

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    #readFile(self){
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        const {files} = enhancedElement;
        if(files === null) return;
        /**
         * @type {Array<any>}
         */
        const fileContents = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            fileContents.push(fileReader.result);
            finishedCount++;
            if(finishedCount === files.length){
                self.fileContents = fileContents;
            }
        }
        fileReader.onerror = (e) => {
            console.error(e);
            console.error(fileReader.error);
        }
        for(const file of files){
            fileReader[readVerb](file);
        }
        self.resolved = true;
    }
}

await BeLiterate.bootUp();
export { BeLiterate }

export class LoadEvent extends Event{

    static EventName = 'load';
    /**
     * @type {Array<any>}
     */
    fileContents;
    constructor(
        fileContents, 

        ){
        
        super(LoadEvent.EventName);
        this.fileContents = fileContents;
    }
}