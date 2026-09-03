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

It causes the input element to emit event "load", and the contents are provided in the event's fileContents.  In case other fellow enhancements are "overloading" the onload event in this way, check that the event's "enh" value is set to the enhKey of the enhancement ('BeLiterate' or '📖', matching the `enhKey` in the registration file) before proceeding.

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

For that we make use of the [Uniform Storage Path](https://github.com/bahrus/trans-render/wiki/VIIII.--Uniform-Storage-Path) protocol:

```html
<input type=file 📖='{
    "writeTo": "indexedDB://myDB/myFiles/{file.name}"
}'>

<script>
        window.addEventListener('message', e => {
            if(e.data instanceof Set && e.data.has('indexedDB://myDB/myFiles')){
                ...
            }
        });
</script>
```



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
