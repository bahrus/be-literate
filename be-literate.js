import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeLiterateController {
    intro(proxy, target, beDecorProps) {
        target.addEventListener('change', this.handleInputChange);
    }
    handleInputChange = (e) => {
        const input = e.target;
        if (!input.checkValidity())
            return;
        const { files } = input;
        if (files === null)
            return;
        const fileContents = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            console.log(e);
            fileContents.push(fileReader.result);
            finishedCount++;
            if (finishedCount === files.length) {
                this.proxy.fileContents = fileContents;
            }
        };
        fileReader.onerror = (e) => {
            console.log(e);
            console.log(fileReader.error);
        };
    };
    finale(proxy, target, beDecorProps) {
        target.removeEventListener('change', this.handleInputChange);
    }
}
const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = 'input[type="file"]';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['fileContents'],
            intro: 'intro',
            emitEvents: ['fileContents']
        },
        actions: {}
    },
    complexPropDefaults: {
        controller: BeLiterateController
    }
});
register(ifWantsToBe, upgrade, tagName);
