// @ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-literate/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    matching: 'input[type="file"]',
    enhConfig: {
        enhKey: 'beLiterate',
        spawn: 'be-literate/be-literate.js',
        withAttrs: {
            base: 'be-literate',
            _base: {
                instanceOf: 'Object',
                mapsTo: '.'
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            storeFileContents: {
                ifAllOf: ['fileContents', 'writeTo']
            }
        },
        compacts: {
            when_readVerb_changes_call_hydrate: 0
        },
        defaultPropVals: {
            readVerb: 'readAsText'
        }
    }
}

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());
