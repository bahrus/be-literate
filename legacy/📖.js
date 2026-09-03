// @ts-check
import { MountObserver, seed, BeHive } from 'be-hive/be-hive.js';
import { emc as baseEMC } from './emc.js';
import { w as bw } from 'be-hive/w.js';
/** @import {EMC} from './ts-refs/trans-render/be/types.d.ts' */

/**
 * @type {EMC}
 */
export const emc = {
    ...baseEMC,
    base: '📖',
    enhPropKey: '📖',
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
