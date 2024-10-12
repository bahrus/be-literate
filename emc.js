// @ts-check
import { BeHive, seed } from 'be-hive/be-hive.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-literate/types' */;
import { w as bw } from 'be-hive/w.js';

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-literate',
    enhPropKey: 'beLiterate',
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.'
        }
    },
    importEnh: async () => {
        const { BeLiterate } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-literate.js'));
        return BeLiterate;
    },
    ws: []
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

/**
 * 
 * @param {import('./ts-refs/trans-render/types').CSSQuery} q 
 */
export function w(q){
    return bw(q, emc.ws);
}