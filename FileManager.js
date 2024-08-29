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

    /**
     * @type {AbortController | undefined}
     */
    #progressAbortController;

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
        this.#errorAbortController = new AbortController()
        fr.addEventListener('error', this, {signal: this.#errorAbortController.signal});
        for(const file of files){
            fr[readVerb](file);
        }
        this.#progressAbortController = new AbortController();
        fr.addEventListener('progress', this, {signal: this.#progressAbortController.signal});
    }

    /**
     * 
     * @param {ProgressEvent} e 
     */
    handleEvent(e){
        const fr = /** @type {FileReader} */ (e.target);
        const {enhancedElement} = this.#self;
        switch(e.type){
            case 'load':
                this.#fileContents.push(fr.result);
                if(this.#fileContents.length === this.#files.length){
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
                //enhancedElement.dispatchEvent(e);
                break;
            case 'progress':
                enhancedElement.dispatchEvent(new FMProgressEvent(e.lengthComputable, e.loaded, e.total));
                break;
                
        }
    }

    disconnect(){
        if(this.#errorAbortController !== undefined) this.#errorAbortController.abort();
        if(this.#loadAbortController !== undefined) this.#loadAbortController.abort();
        if(this.#progressAbortController !== undefined) this.#progressAbortController.abort();
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

export class ErrorEvent extends Event{

}

export class FMProgressEvent extends Event{
    static EventName = 'progress';
    /**
     * @type {Boolean}
     */
    lengthComputable;
    /**
     * @type {Number}
     */    
    loaded;
    /**
     * @type {Number}
     */
    total;
    /**
     * 
     * @param {Boolean} lengthComputable 
     * @param {Number} loaded 
     * @param {Number} total 
     */
    constructor(lengthComputable, loaded, total){
        super(FMProgressEvent.EventName);
        this.lengthComputable = lengthComputable;
        this.loaded = loaded;
        this.total = total;
    }
}