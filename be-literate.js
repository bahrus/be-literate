// @ts-check
/** @import {Actions, PAP, AllProps, AP, ProPAP} from './types/be-literate/types' */;
/** @import {RoundaboutOptions, RAConfig} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {USL} from './types/be-literate/types' */;

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 */
class BeLiterate {

    /**
     * @type {AbortController | undefined}
     */
    #abortController;

    /**
     * Enhancement key ('beLiterate' or '📖'), stamped onto the load / progress events
     * so consumers overloading these event names can tell which enhancement fired.
     * @type {string | symbol}
     */
    #enhKey;

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement
     * @param {SpawnContext} ctx
     * @param {PAP} initVals
     */
    constructor(enhancedElement, ctx, initVals){
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps} self
     * @param {Element & ElementEnhancementGateway} enhancedElement
     * @param {SpawnContext} ctx
     * @param {PAP} initVals
     */
    async init(self, enhancedElement, ctx, initVals){
        const {customData} = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc);
        this.#enhKey = ctx.config.enhKey;
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * @param {Event} e
     */
    async handleEvent(e) {
        const self = /** @type {AP} */ (/** @type {any} */ (this));
        this.#readFile(self);
    }

    /**
     * @param {AP} self
     */
    async hydrate(self){
        this.#disconnect();
        this.#abortController = new AbortController();
        const {enhancedElement} = self;
        enhancedElement.addEventListener('change', this, {signal: this.#abortController.signal});
        return /** @type {PAP} */ ({resolved: true});
    }

    /**
     * @param {AP} self
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
     * @param {AP} self
     */
    async storeFileContents(self){
        /** @type {Array<USL>} */
        const writtenTo = [];
        const {fileContents, writeTo} = self;
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
        });
    }

    #disconnect(){
        if(this.#abortController !== undefined) this.#abortController.abort();
    }

    /**
     * @param {AP} self
     */
    async #readFile(self){
        const {enhancedElement} = self;
        if(!enhancedElement.checkValidity()) return;
        const {FileManager} = await import('be-literate/FileManager.js');
        new FileManager(self, this.#enhKey);
    }
}

export { BeLiterate }
