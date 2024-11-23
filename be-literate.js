// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-literate/types.d.ts' */;
/** @import {EnhancementInfo} from './node_modules/be-enhanced/ts-refs/trans-render/be/types.d.ts' */
/** @import {USL} from './ts-refs/trans-render/XV/types' */



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
            writeTo: {},
            fileContents: {},
            writtenTo: {},
        },
        compacts: {
            when_readVerb_changes_invoke_hydrate: 0,
        },
        actions: {
            storeFileContents:{
                ifAllOf: ['fileContents', 'writeTo']
            }
        },
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
    async handleEvent(e) {
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
     * @param {BAP} self 
     */
    async hydrate(self){
        this.#disconnect();
        this.#abortController = new AbortController();
        const {enhancedElement} = self;
        enhancedElement.addEventListener('change', this, {signal: this.#abortController.signal});
        return /** @type {PAP} */ ({resolved: true});
    }

    /**
     * 
     * @param {BAP} self 
     * @param {any} c 
     * @param {USL} adjustedWriteTo
     */
    async parseContents(self, c, adjustedWriteTo){
        let adjustedContent = c;
        const {readVerb} = self;
        if(readVerb === 'readAsText' && adjustedWriteTo.startsWith('indexedDB://')){
            try{
                //TODO:  as?
                adjustedContent = JSON.parse(c);
            }catch(e){}
        }
        return adjustedContent;
    }

    /**
     * 
     * @param {BAP} self 
     */
    async storeFileContents(self){
        /** @type {Array<USL>} */
        const writtenTo = [];
        const {fileContents, writeTo, readVerb} = self;
        const {set} = await import('trans-render/XV/set.js');
        for(const fc of fileContents){
            const [f, c] = fc;
            let adjustedWriteTo = writeTo;
            for(const key in f){
                const val = f[key];
                if(val){
                    adjustedWriteTo = /** @type {USL} */(adjustedWriteTo.replaceAll(`{file.${key}}`, val.toString()));
                }
                
            }
            const adjustedContent = await this.parseContents(self, c, adjustedWriteTo);
            await set(adjustedWriteTo, adjustedContent);
            writtenTo.push(adjustedWriteTo);
        }
        return /** @type {PAP} */ ({
            writtenTo,
            fileContents: undefined
        })
    }

    #disconnect(){
        if(this.#abortController !== undefined) this.#abortController.abort();
    }

    /**
     * 
     * @param {AP & BEAllProps} self 
     * @returns 
     */
    async #readFile(self){
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        const {FileManager} = await import('./FileManager.js')
        const fileManager = new FileManager(self, this.#ei);
    }
}

await BeLiterate.bootUp();
export { BeLiterate }

