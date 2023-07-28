import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, Proxy} from './types';
import {register} from 'be-hive/register.js';

export class BeLiterateController extends EventTarget implements Actions{
    
    #abortController: AbortController | undefined;
    intro(proxy: Proxy, target: HTMLInputElement, beDecorProps: BeDecoratedProps){
        this.disconnect();
        this.#abortController = new AbortController();
        target.addEventListener('change', e => {
            this.readFile(proxy);
        }, {
            signal: this.#abortController.signal,
        });
        this.readFile(proxy);
    }
    readFile(proxy: Proxy){
        const {self} = proxy;
        if(!self.checkValidity()) return;
        const {files} = self;
        if(files === null) return;
        const fileContents: any[] = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e: Event) => {
            fileContents.push(fileReader.result);
            finishedCount++;
            if(finishedCount === files.length){
                proxy.fileContents = fileContents;
            }
        }
        fileReader.onerror = (e: Event) => {
            console.error(e);
            console.error(fileReader.error);
        }
        const verb = proxy.readVerb;
        for(const file of files){
            fileReader[verb](file);
        }
        proxy.resolved = true;
    }
    handleInputChange = (e: Event) => {

    }
    disconnect(){
        if(this.#abortController !== undefined) this.#abortController.abort();
    }
    finale(){
        this.disconnect();
    }
    
}


const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = 'input[type="file"]';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            virtualProps: ['fileContents'],
            intro: 'intro',
            proxyPropDefaults:{
                readVerb: 'readAsText'
            },
            primaryProp: 'readVerb',
            emitEvents: ['fileContents'],
        },
    },
    complexPropDefaults:{
        controller: BeLiterateController
    }
});
register(ifWantsToBe, upgrade, tagName);