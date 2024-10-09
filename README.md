# be-literate (📖)

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
" onprogress="console.log(event)">
```

It causes the input element to emit event "load", and the contents are provided in the event's fileContents.  In case other fellow enhancements are "overloading" the onload event in this way, check that the event's "enh" value is set to the name of the enhancement within the Shadow Realm ('beLiterate' or '📖', for example) before proceeding.

## Security [TODO]

Unfortunately, the platform provides no support for being able to confirm the integrity of the markup shown above.

So in fact when you run the code above with "minimal" CSP rules in place, it won't work.  You would instead need to attach the onload/onprogress event handlers via a script that knows how to locate the element, or via a framework or a web component host.

So what are the ways we can attach these event listeners onto the input element.  

There are traditional ways, i.e. via a framework or web component or rendering helper library.

For example:

```html
<input id=myFileInput type=file be-literate onload="
    const {fileContents} = event;
    console.log({fileContents});
" onprogress="console.log(event)">
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


But be-literate itself provides the following support:

```html
<script type=module>
    const {on} = await import('be-literate/emc.js');
    const id = '3TQBxg+JRkCJBoDO9cANgA'
    on('load', id, e => {
        console.log(e.fileContents);
    });
    on('progress', id, e => {
        console.log(e);
    })
</script>
<input  id=3TQBxg+JRkCJBoDO9cANgA type=file be-literate>
```

The problem is timing.  We can't guarantee the event handlers would be attached before be-literate does it's thing.

Granted, the requirement that the user select a file makes the timing issue fairly low risk in this case.

But aside from that, how can we guarantee no timing issues?

Option 1:  Use disabled / nudge
Option 2:  Script activates be-literate enhancement

```html
<script type=module>
    const {on, do} = await import('be-literate/emc.js');
    const id = '3TQBxg+JRkCJBoDO9cANgA'
    on('load', id, e => {
        console.log(e.fileContents);
    }, {
        initOn: 'resolved'
    });
    on('progress', id, e => {
        console.log(e);
    });

</script>
<input disabled id=3TQBxg+JRkCJBoDO9cANgA type=file be-literate>
```

## Alternative names

In a closed environment, where the chances of clashes with other custom attributes can be controlled, consider using a smaller name, like 📖, by referencing an [alternate EMC file](https://github.com/bahrus/be-literate/blob/baseline/%F0%9F%93%96.js):

```html
<input type=file 📖 onload="
    const {fileContents} = event;
    console.log({fileContents});
">
```

(On Windows, for the 📖 emoji, type 🪟 + . + open book, and it will remain in recent memory).

The file contents can be read via path: inputEl.beEnhanced.beLiterate.fileContents (or inputEl.beEnhanced.📖.fileContents).

## Specifying Read Option

To specify which of the file read options to apply to the file(s), set the attribute:

```html
<input type=file 📖='{"readVerb": "readAsDataURL"}' >
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
