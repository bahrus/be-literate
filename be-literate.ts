import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLiterateActions, BeLiterateProps, BeLiterateVirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeLiterateController implements BeLiterateActions{
    
    intro(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps){
        target.addEventListener('change', this.handleInputChange);
    }
    handleInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if(!input.checkValidity()) return;
        const {files} = input;
        if(files === null) return;
        const fileContents: any[] = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e: Event) => {
            console.log(e);
            fileContents.push(fileReader.result);
            finishedCount++;
            if(finishedCount === files.length){
                this.proxy.fileContents = fileContents;
            }
        }
        fileReader.onerror = (e: Event) => {
            console.log(e);
            console.log(fileReader.error);
        }
    }
    finale(proxy: HTMLInputElement & BeLiterateVirtualProps, target: HTMLInputElement, beDecorProps: BeDecoratedProps){
        target.removeEventListener('change', this.handleInputChange);
    }
}

export interface BeLiterateController extends BeLiterateProps{}

const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = 'input[type="file"]';

define<BeLiterateProps & BeDecoratedProps<BeLiterateProps, BeLiterateActions>, BeLiterateActions>({
    config:{
        tagName,
        propDefaults:{
            virtualProps: ['fileContents'],
            intro: 'intro',
            emitEvents: ['fileContents']
        },
        actions:{

        }
    },
    complexPropDefaults:{
        controller: BeLiterateController
    }
});
register(ifWantsToBe, upgrade, tagName);