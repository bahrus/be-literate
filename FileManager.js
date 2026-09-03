// @ts-check

/** @import {AP, AllProps, FileAndContents} from './types/be-literate/types' */;

const sym = Symbol();

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
     * @type {Array<FileAndContents>}
     */
    #fileContents = [];

    /**
     * @type {AP}
     */
    #self;

    /**
     * Enhancement key ('beLiterate' or '📖'), stamped onto dispatched events.
     * @type {string | symbol}
     */
    #enhKey;


    /**
     *
     * @param {AP} self
     * @param {string | symbol} enhKey
     * @returns
     */
    constructor(self, enhKey){
        const {enhancedElement, readVerb} = self;
        this.#self = self;
        this.#enhKey = enhKey;
        const {files} = enhancedElement;
        //console.log({files});
        if(files === null) return;
        this.#files = files;
        for(const file of files){
            const fr = new FileReader();
            fr[sym] = file;
            this.#fileReader = fr;
            this.#loadAbortController = new AbortController();
            fr.addEventListener('load', this, {signal: this.#loadAbortController.signal});
            this.#errorAbortController = new AbortController()
            fr.addEventListener('error', this, {signal: this.#errorAbortController.signal});
            this.#progressAbortController = new AbortController();
            fr.addEventListener('progress', this, {signal: this.#progressAbortController.signal});
            fr[readVerb](file);
        }

    }

    /**
     *
     * @param {ProgressEvent} e
     */
    handleEvent(e){
        const fr = /** @type {FileReader} */ (e.target);
        const {enhancedElement} = this.#self;
        const enh = this.#enhKey;
        if(enh === undefined) throw 500;
        switch(e.type){
            case 'load':
                const file = fr[sym];
                this.#fileContents.push([file, fr.result]);
                if(this.#fileContents.length === this.#files.length){
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
                enhancedElement.dispatchEvent(new FMProgressEvent(e.lengthComputable, e.loaded, e.total, enh));
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
     * @type {Array<FileAndContents>}
     */
    fileContents;

    /**
     * @type {Array<string>}
     */
    fileNames;
    /**
     * @type {string | symbol}
     */
    enh;

    /**
     *
     * @param {Array<FileAndContents>} fileContents
     * @param {string | symbol} enh
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
     * @type {string | symbol}
     */
    enh;
    /**
     *
     * @param {Boolean} lengthComputable
     * @param {Number} loaded
     * @param {Number} total
     * @param {String | symbol} enh
     */
    constructor(lengthComputable, loaded, total, enh){
        super(FMProgressEvent.EventName);
        this.lengthComputable = lengthComputable;
        this.loaded = loaded;
        this.total = total;
        this.enh = enh;
    }
}
