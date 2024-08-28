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

    /**
     * @type {EnhancementInfo}
     */
    #ei;


    /**
     * 
     * @param {AP & BEAllProps} self 
     * @param {EnhancementInfo} ei
     * @returns 
     */
    constructor(self, ei){
        const {enhancedElement, readVerb} = self;
        this.#self = self;
        this.#ei = ei;
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
                    const enh = this.#ei.mountCnfg?.enhPropKey;
                    if(enh === undefined) throw 500;
                    this.#self.fileContents = this.#fileContents;
                    const le = new LoadEvent(this.#fileContents, enh);
                    enhancedElement.dispatchEvent(le);
                    this.disconnect();
                }
                break;
            case 'error':
                console.error(e);
                break;
        }
    }

    disconnect(){
        if(this.#errorAbortController !== undefined) this.#errorAbortController.abort();
        if(this.#loadAbortController !== undefined) this.#loadAbortController.abort();
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
            when_readVerb_changes_invoke_hydrate: 0,
        },
        //actions: {},
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
     * @type {EnhancementInfo}
     */
    #ei;


    /**
     * 
     * @param {Element} enhancedElement 
     * @param {EnhancementInfo} enhancementInfo
     * @override 
     */
    async attach(enhancedElement, enhancementInfo){
        console.log(enhancementInfo);
        this.#ei = enhancementInfo;
        await super.attach(enhancedElement, enhancementInfo);
    }

    /**
     * 
     * @param {Element} enhancedElement 
     * @override 
     */
    async detach(enhancedElement){
        await super.detach(enhancedElement);
        this.#disconnect()
    }

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    async hydrate(self){
        this.#disconnect();
        this.#abortController = new AbortController();
        const {enhancedElement} = self;
        enhancedElement.addEventListener('change', this, {signal: this.#abortController.signal});
        return {resolved: true}
    }

    #disconnect(){
        if(this.#abortController !== undefined) this.#abortController.abort();
    }

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    #readFile(self){
        console.log({self});
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        // const {files} = enhancedElement;
        // if(files === null) return;
        const fileManager = new FileManager(self, this.#ei);
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

    /**
     * @type {string}
     */
    enh;

    /**
     * 
     * @param {Array<any>} fileContents 
     * @param {string} enh 
     */
    constructor(
        fileContents, 
        enh
        ){
        
        super(LoadEvent.EventName);
        this.fileContents = fileContents;
        this.enh = enh;
    }
}