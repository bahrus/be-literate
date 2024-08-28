// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-literate/types.d.ts' */;

/**
 * @implements {Actions}
 * 
 */
class BeLiterate extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement, any>}
     */
    static config = {

    }
}

await BeLiterate.bootUp();
export { BeLiterate }