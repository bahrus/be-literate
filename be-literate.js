// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-literate/types.d.ts' */;
/** @import {EnhancementInfo} from './ts-refs/trans-render/be/types.d.ts' */


/** @implements {EventListenerObject} */
class FileManager {
    /**
     * @type {FileReader}
     */
    #fileReader;
    /**
     * @type {AbortController | undefined}
     */
    #loadAbortController;

    /**
     * @type {AbortController | undefined}
     */
    #errorAbortController;

    /** @type {FileList} */
    #files;

    /**
     * @type {Array<any>}
     */
    #fileContents = [];

    /**
     * @type {AP & BEAllProps}
     */
    #self;

    //#totalFileCountRead = 0;

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    constructor(self){
        const {enhancedElement, readVerb} = self;
        this.#self = self;
        const {files} = enhancedElement;
        if(files === null) return;
        this.#files = files;
        const fr = new FileReader();
        this.#fileReader = fr;
        this.#loadAbortController = new AbortController();
        fr.addEventListener('load', this, {signal: this.#loadAbortController.signal});
        for(const file of files){
            fr[readVerb](file);
        }
    }

    /**
     * 
     * @param {ProgressEvent} e 
     */
    handleEvent(e){
        //console.log({e});
        const fr = /** @type {FileReader} */ (e.target);
        switch(e.type){
            case 'load':
                this.#fileContents.push(fr.result);
                if(this.#fileContents.length === this.#files.length){
                    const {enhancedElement} = this.#self;
                    const le = new LoadEvent(this.#fileContents);
                    enhancedElement.dispatchEvent(le);
                }
                break;
            case 'error':
                break;
        }
    }
}

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class BeLiterate extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults: {
            readVerb: 'readAsText',
        },
        propInfo: {
            ...propInfo,
        },
        compacts: {
            //when_itemCE_changes_invoke_attachProp: 0
        },
        actions: {},
        positractions: [
            resolved, rejected,
        ]
    };

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
     * 
     * @param {Element} enhancedElement 
     * @param {EnhancementInfo} enhancementInfo
     * @override 
     */
    async attach(enhancedElement, enhancementInfo){
        await super.attach(enhancedElement, enhancementInfo);
        this.#abortController = new AbortController()
        enhancedElement.addEventListener('change', this, {signal: this.#abortController.signal});
        this.resolved = true;
    }

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    #readFile(self){
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        // const {files} = enhancedElement;
        // if(files === null) return;
        const fileManager = new FileManager(self);

        // let finishedCount = 0;
        // const fileReader = new FileReader();
        // fileReader.onload = (e) => {
        //     fileContents.push(fileReader.result);
        //     finishedCount++;
        //     if(finishedCount === files.length){
        //         self.fileContents = fileContents;
        //     }
        // }
        // fileReader.onerror = (e) => {
        //     console.error(e);
        //     console.error(fileReader.error);
        // }
        // for(const file of files){
        //     fileReader[readVerb](file);
        // }
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