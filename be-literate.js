import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeLiterateController extends EventTarget {
    #abortController;
    intro(proxy, target, beDecorProps) {
        this.disconnect();
        this.#abortController = new AbortController();
        target.addEventListener('change', e => {
            this.readFile(proxy);
        }, {
            signal: this.#abortController.signal,
        });
        this.readFile(proxy);
    }
    readFile(proxy) {
        const { self } = proxy;
        if (!self.checkValidity())
            return;
        const { files } = self;
        if (files === null)
            return;
        const fileContents = [];
        let finishedCount = 0;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            fileContents.push(fileReader.result);
            finishedCount++;
            if (finishedCount === files.length) {
                proxy.fileContents = fileContents;
            }
        };
        fileReader.onerror = (e) => {
            console.error(e);
            console.error(fileReader.error);
        };
        const verb = proxy.readVerb;
        for (const file of files) {
            fileReader[verb](file);
        }
        proxy.resolved = true;
    }
    handleInputChange = (e) => {
    };
    disconnect() {
        if (this.#abortController !== undefined)
            this.#abortController.abort();
    }
    finale() {
        this.disconnect();
    }
}
const tagName = 'be-literate';
const ifWantsToBe = 'literate';
const upgrade = 'input[type="file"]';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: ['fileContents'],
            intro: 'intro',
            proxyPropDefaults: {
                readVerb: 'readAsText'
            },
            primaryProp: 'readVerb',
            emitEvents: ['fileContents'],
        },
    },
    complexPropDefaults: {
        controller: BeLiterateController
    }
});
register(ifWantsToBe, upgrade, tagName);
