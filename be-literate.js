import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeLiterate extends BE {
    static get beConfig() {
        return {
            parse: true,
        };
    }
    #abortController;
    async attach(enhancedElement, enhancementInfo) {
        await super.attach(enhancedElement, enhancementInfo);
        this.#abortController = new AbortController();
        enhancedElement.addEventListener('change', e => {
            this.#readFile(this);
        }, {
            signal: this.#abortController.signal,
        });
        this.#readFile(this);
    }
    #readFile(self) {
        const { enhancedElement, readVerb } = self;
        if (!enhancedElement.checkValidity())
            return;
        const { files } = enhancedElement;
        if (files === null)
            return;
        const fileContents = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            fileContents.push(fileReader.result);
            finishedCount++;
            if (finishedCount === files.length) {
                self.fileContents = fileContents;
            }
        };
        fileReader.onerror = (e) => {
            console.error(e);
            console.error(fileReader.error);
        };
        for (const file of files) {
            fileReader[readVerb](file);
        }
        self.resolved = true;
    }
    #disconnect() {
        if (this.#abortController !== undefined)
            this.#abortController.abort();
    }
    detach(detachedElement) {
        super.detach(detachedElement);
        this.#disconnect();
    }
}
const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            readVerb: 'readAsText',
        },
        propInfo: {
            ...propInfo,
            fileContents: {
                notify: {
                    dispatch: true,
                    dispatchFromEnhancedElement: true,
                }
            }
        },
        actions: {}
    },
    superclass: BeLiterate
});
register(ifWantsToBe, upgrade, tagName);
