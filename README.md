# be-literate (📖)

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-literate?style=for-the-badge)](https://bundlephobia.com/result?p=be-literate)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-literate?compression=gzip">
<a href="https://nodei.co/npm/be-literate/"><img src="https://nodei.co/npm/be-literate.png"></a>

Enhance the input element so it can declaratively read contents from a local file (or files).

be-literate turns this [code snippet](https://www.w3docs.com/learn-javascript/file-and-filereader.html) into an attribute-based HTML Enhancement / Decorator / Behavior / Directive / Custom Attribute.

## Registration

be-literate is registered with [be-hive](https://github.com/bahrus/be-hive) by pointing at the generated EMC JSON config:

```html
<be-hive>
    <script type=emc src="be-literate/📖.json"></script>
</be-hive>
<script type=module>
    import 'be-hive/be-hive.js';
</script>
```

Use `be-literate/emc.json` for the full `be-literate` attribute name, or `be-literate/📖.json` for the `📖` shorthand.

## Example 1

```html
<input type=file be-literate onload="
    const {fileContents} = event;
    console.log({fileContents});
" onprogress="console.log(event)">
```

It causes the input element to emit event "load", and the contents are provided in the event's fileContents.  In case other fellow enhancements are "overloading" the onload event in this way, check that the event's "enh" value is set to the enhKey of the enhancement ('beLiterate' or '📖', matching the `enhKey` in the registration file) before proceeding.

## Alternative names

In a closed environment, where the chances of clashes with other custom attributes can be controlled, consider using a smaller name, like 📖, by registering the [alternate EMC config](https://github.com/bahrus/be-literate/blob/baseline/%F0%9F%93%96.mjs) (`📖.json`) as shown under [Registration](#registration):

```html
<input type=file 📖 onload="
    const {fileContents} = event;
    console.log({fileContents});
">
```

(On Windows, for the 📖 emoji, type 🪟 + . + open book, and it will remain in recent memory for future lookups).

## Security

Unfortunately, the platform provides no support for being able to confirm the integrity of the markup shown above.

So in fact when you run the code above with "minimal" CSP rules in place, it won't work.  You would instead need to attach the onload/onprogress event handlers via a script that knows how to locate the element, or via a framework or a web component host.

So what are the ways we can attach these event listeners onto the input element?  

There are traditional ways, i.e. via a framework or web component or rendering helper library.

For example:

```html
<input id=myFileInput type=file 📖>
<script>
myFileInput.addEventListener('load', e => {
    const {fileContents} = e;
    console.log({fileContents});
});
myFileInput.addEventListener('progress', e => {
    console.log(e);
});

</script>
```


> **Note:** Earlier versions of be-literate exposed a `.w(cssQuery).a({...})` helper from the
> registration module. The modern build generates a static JSON config instead of a runtime
> module, so that helper is gone — attach listeners directly with `addEventListener` as shown
> above, or via your framework / web component host.

## Specifying Read Option

To specify which of the file read options to apply to the file(s), set the attribute:

```html
<input type=file 📖='{"readVerb": "readAsDataURL"}' >
```

If not specified, as above, the default is readAsText.

## Where to store and read the file contents?

By default, the contents of the file are provided on the `load` event (`event.fileContents`), and are
also assigned to the `fileContents` property of the enhancement instance.

However, being that:

1.  The contents of the file could be quite large, so using RAM may not be ideal for long term storage, and
2.  The file contents may be applicable to a large "audience" of components within the application
3.  Reaching into the enhancement instance for `fileContents` is a bit cumbersome (and there are timing considerations to grapple with as well)

... it seems  worthwhile to provide for more "strategic" locations to store/retrieve the contents.

For that we make use of the Uniform Storage Path (USL) protocol, via [`fifteenth`](https://github.com/bahrus/fifteenth)'s `set`:

```html
<input type=file 📖='{
    "writeTo": "indexedDB://myDB/myFiles/{file.name}"
}'>

<script>
        // fifteenth broadcasts window.postMessage([usp])  — an Array of USL strings —
        // (or [usp, usl] when the writeTo USL carries a ?. accessor chain).
        window.addEventListener('message', e => {
            if(Array.isArray(e.data) && e.data.some(u => u.startsWith('indexedDB://myDB/myFiles/'))){
                ...
            }
        });
</script>
```

`writeTo` also accepts `localStorage://`, `sessionStorage://`, `cookie://`, `locationHash://` and
`globalThis://` targets — see the [`fifteenth` docs](https://github.com/bahrus/fifteenth#one-time-push-of-single-resource).



## Programmatic attachment (no attribute)

The attribute syntax above shines for server-rendered HTML and progressive enhancement, where the markup alone says what the enhancement does.

Most web development today, though, renders on the client, with a framework (Lit, React, Vue, Svelte, etc.) that already has a JavaScript reference to each `<input type=file>` it creates. There, attaching be-literate programmatically is the better fit:

1. **A less clunky API.** Frameworks are awkward about setting arbitrary attributes, let alone emoji ones like `📖`. Instead of building the string `'{"readVerb": "readAsDataURL", "writeTo": "indexedDB://myDB/myFiles/{file.name}"}'` and stuffing it into an attribute, you set `readVerb` and `writeTo` as plain properties.
2. **Less stringifying and parsing.** With the attribute, your code serializes those settings to a JSON string, and be-literate `JSON.parse`s it back apart. Programmatically, the values pass straight through.
3. **Less overhead monitoring attributes.** The attribute approach relies on be-hive / mount-observer watching the DOM for `input[type=file]` elements that carry (or gain) the `be-literate` / `📖` attribute, and for changes to its value. `def.js` doesn't load mount-observer at all. It just registers the config, and be-literate is attached exactly when, and to exactly the elements, your code says.

Either way, it's the **same enhancement**, with the same defaults (`readVerb` defaults to `readAsText`), the same `load` / `progress` events, and the same `writeTo` behavior. The two approaches can be mixed in one app: attributes for server-rendered islands, programmatic attachment inside client-rendered components.

### Registration

Register the config once, via `def.js`:

```JS
import { defBeLiterate } from 'be-literate/def.js';
const emc = await defBeLiterate(document.body); // or a shadow root's host, for a scoped registry
```

### Attribute → property mapping

Each key of the attribute's JSON value is a property of the same name:

| Attribute | Property | Notes |
|-----------|----------|-------|
| `📖` / `be-literate` (no value) | (none) | Attaching is enough: set any property via `enh.set`, or call `enh.get(emc)`. |
| `{"readVerb": "readAsDataURL"}` | `readVerb` | `'readAsText'` (default), `'readAsDataURL'`, `'readAsArrayBuffer'` or `'readAsBinaryString'`. |
| `{"writeTo": "indexedDB://myDB/myFiles/{file.name}"}` | `writeTo` | A USL string. `{file.name}` (and other `{file.*}` placeholders) are substituted per file. |

The results are on the instance too: `fileContents` (cleared once it has been written to `writeTo`) and `writtenTo` (the USLs written).

### Declarative -- via `enh.set`

```JS
// equivalent to <input type=file 📖='{"readVerb": "readAsDataURL", "writeTo": "indexedDB://myDB/myFiles/{file.name}"}'>
myFileInput.enh.set.beLiterate.readVerb = 'readAsDataURL';
myFileInput.enh.beLiterate.writeTo = 'indexedDB://myDB/myFiles/{file.name}';
```

Only the first property needs to go through `.set`, since that access triggers attachment. This works before or after `defBeLiterate` has been called.

### Imperative -- via `enh.get()`

```JS
Object.assign(myFileInput.enh.get(emc), {
    readVerb: 'readAsDataURL',
    writeTo: 'indexedDB://myDB/myFiles/{file.name}',
});
```

### Gotcha: the event's `enh` value

When attached programmatically, the `load` and `progress` events carry `enh === 'beLiterate'` (the `enhKey` in `emc.json`), never `'📖'`, even if the `📖` attribute is used elsewhere in the app. If you filter events by `enh`, as suggested in [Example 1](#example-1), check for `'beLiterate'`.

See [demo/Programmatic](demo/Programmatic/) for runnable examples.

## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule update --init --recursive
6. > npm install
7. > npm run build
8. > npm run serve
9. Open http://localhost:8000/demo/ in a modern browser (Chrome/Edge 146+ — JSON module imports with type assertion are required)

## Running Tests

```
> npm run test
```
