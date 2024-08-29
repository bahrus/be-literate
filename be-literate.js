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
    async #readFile(self){
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        const {FileManager} = await import('./FileManager.js')
        const fileManager = new FileManager(self, this.#ei);
    }
}

await BeLiterate.bootUp();
export { BeLiterate }

