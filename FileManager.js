// @ts-check

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-literate/types.d.ts' */;
/** @import {EnhancementInfo} from './ts-refs/trans-render/be/types.d.ts' */


/** @implements {EventListenerObject} */
export class FileManager {
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