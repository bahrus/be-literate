# be-literate

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-literate?style=for-the-badge)](https://bundlephobia.com/result?p=be-literate)

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-literate?compression=gzip">

<a href="https://nodei.co/npm/be-literate/"><img src="https://nodei.co/npm/be-literate.png"></a>

Enhance the input element so it can declaratively read contents from a local file (or files).

be-literate turns this [code snippet](https://www.w3docs.com/learn-javascript/file-and-filereader.html) into an attribute-based HTML Decorator / Behavior / Directive / Custom Attribute.

Syntax:

```html
<input type=file be-literate>
```

It causes the input element to emit event "literate::file-contents-changed", and the contents are provided in the custom event's detail.value property.

The file contents can be read via path: inputEl.beDecorated.literate.fileContents.

## Specifying Read Option

To specify which of the file read options to apply to the file(s), set the attribute:

```html
<input type=file be-literate=readAsDataURL>
```

If not specified, as above, the default is readAsText.