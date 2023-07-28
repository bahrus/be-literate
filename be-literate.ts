import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeLiterate extends BE<AP, Actions, HTMLInputElement> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
        } as BEConfig;
    }
}

export interface BeLiterate extends AllProps{}

const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
            ...propDefaults
        },
        propInfo:{
            ...propInfo
        },
        actions:{}
    },
    superclass: BeLiterate
});

register(ifWantsToBe, upgrade, tagName);