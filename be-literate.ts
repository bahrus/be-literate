import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, EnhancementInfo} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeLiterate extends BE<AP, Actions, HTMLInputElement> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
        } as BEConfig;
    }

    #abortController: AbortController | undefined;
    override async attach(enhancedElement: HTMLInputElement, enhancementInfo: EnhancementInfo): Promise<void> {
        await super.attach(enhancedElement, enhancementInfo);
        this.#abortController = new AbortController();
        enhancedElement.addEventListener('change', e => {
            this.#readFile(this);
        }, {
            signal: this.#abortController.signal,
        });
        this.#readFile(this);
    }

    #readFile(self: this){
        const {enhancedElement, readVerb} = self;
        if(!enhancedElement.checkValidity()) return;
        const {files} = enhancedElement;
        if(files === null) return;
        const fileContents: any[] = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e: Event) => {
            fileContents.push(fileReader.result);
            finishedCount++;
            if(finishedCount === files.length){
                self.fileContents = fileContents;
            }
        }
        fileReader.onerror = (e: Event) => {
            console.error(e);
            console.error(fileReader.error);
        }
        for(const file of files){
            fileReader[readVerb](file);
        }
        self.resolved = true;
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