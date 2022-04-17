# be-literate [TODO]

Declaratively read contents from a local file.

be-literate turns this [code snippet](https://www.w3docs.com/learn-javascript/file-and-filereader.html) into an attribute-based HTML Decorator / Behavior / Directive / Custom Attribute.

Syntax:

```html
<input type=file be-literate>
```

It causes the input element to emit event be-literate::file-contents-changed.

Can also notify neighboring elements (including host) via [be-noticed](https://github.com/bahrus/be-noticed) syntax.