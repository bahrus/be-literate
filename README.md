# be-literate (📖) [TODO]

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-literate?style=for-the-badge)](https://bundlephobia.com/result?p=be-literate)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-literate?compression=gzip">
<a href="https://nodei.co/npm/be-literate/"><img src="https://nodei.co/npm/be-literate.png"></a>

Enhance the input element so it can declaratively read contents from a local file (or files).

be-literate turns this [code snippet](https://www.w3docs.com/learn-javascript/file-and-filereader.html) into an attribute-based HTML Enhancement / Decorator / Behavior / Directive / Custom Attribute.

Syntax:

```html
<input type=file be-literate onload="
    const {fileContents} = event;
    console.log({fileContents});
">
```

It causes the input element to emit event "load", and the contents are provided event's fileContents.

The file contents can be read via path: inputEl.beEnhanced.beLiterate.fileContents.

In a closed environment, where the chances of clashes with other custom attributes can be controlled, consider using a smaller name, like , by referencing an alternate EMC file:

```html
<input type=file 📖 onload="
    const {fileContents} = event;
    console.log({fileContents});
">
```

## Specifying Read Option

To specify which of the file read options to apply to the file(s), set the attribute:

```html
<input type=file be-literate=readAsDataURL>
```

If not specified, as above, the default is readAsText.

## Running locally

Any web server than can serve static files will do, but...

1.  Install git.
2.  Do a git clone or a git fork of repository https://github.com/bahrus/be-literate
3.  Install node.js
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Using from ESM Module:

```JavaScript
import 'be-literate/behivior.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-literate';
</script>
```
