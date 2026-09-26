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
            // Gated on `initialized` (set at the end of `init`) rather than a
            // `readVerb` change alone: a `readVerb` assigned programmatically
            // before roundabout finishes wiring accessors is "rescued" as the
            // accessor's initial value without notifying, so a readVerb-only
            // trigger would never fire hydrate in that case.
            hydrate: {
                ifKeyIn: ['readVerb', 'initialized'],
                ifAllOf: ['enhancedElement', 'initialized']
            },
            storeFileContents: {
                ifAllOf: ['fileContents', 'writeTo']
            }
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
