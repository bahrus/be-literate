# be-literate

Declaratively read contents from a local file.

be-literate turns this [code snippet](https://www.w3docs.com/learn-javascript/file-and-filereader.html) into an attribute-based HTML Decorator / Behavior / Directive / Custom Attribute.

Syntax:

```html
<input type=file be-literate>
```

It causes the input element to emit event literate::file-contents-changed, and the contents are provided in the custom event's detail.value property.

The file contents can be read via path: inputEl.beDecorated.literate.fileContents.