# cables.gl react integration and component

Small component to load one or more [cables.gl](https://cables.gl/) patches in your [react](https://react.dev/) app

The component is in `src/CablesPatch.jsx`, `src/cablesPatch.js` loads the exported patch. copy both files into your
project. `src/App.jsx` shows how to use it.

## Usage

**This only works with exports using the "single javascript file" option** (the export needs a `js/patch.js`)

- Export your patch as "HTML" and select "single javascript file"
- You can use cables.gl, the [cables standalone](https://dev.cables.gl/standalone) or [cables-cli](https://www.npmjs.com/package/@cables/cables) to get this type of export
- Unzip the export into `public/patch`, or any other folder below `public/`

```jsx
<CablesPatch className="patch" />
```

or with more config options, e.g. when needing to load a module dependeny (like mikktspace.js):

```jsx
<CablesPatch
  patchDir="/other-patch/"
  libs={[{ src: "js/mikktspace.js", export: "MIKKTSPACE" }]}
  patchOptions={{ onPatchLoaded: (patch) => {} }}
/>
```

- `patchDir`: url of the export folder, defaults to `/patch/`, the component loads `js/patch.js` from there
- `jsPath`: folder of `patch.js` and the other javascript files, relative to `patchDir`, defaults to `js/`
- `prefixAssetPath`: where the files used in the patch are loaded from, relative to `patchDir`.
- `libs`: libraries the patch needs, paths are relative to `patchDir`
  - `{ "src": "js/mikktspace.js", "export": "MIKKTSPACE" }` is imported as a module and put into `window.MIKKTSPACE`
  - a string is loaded as a normal script, e.g. `"https://cdn.example.com/lib.js"`
  - check the `index.html` of your export: every `<script type="module">import * as NAME from "./js/file.js"...`
    goes in as `{ "src": "js/file.js", "export": "NAME" }`, every `<script src="...">`, except for `js/patch.js` as a string
- `patchOptions`: passed to `new CABLES.Patch()`, e.g. `onPatchLoaded`, `onFinishedLoading`, `onError`

The patch is stopped and removed when the component unmounts.

Every `patch.js` contains its own copy of the cables core, so when using more than one patch on a page, export all of
them with the same cables version.

## Requirements

- nodejs and npm in a current version

## Installation

- check out this repository
- run `npm install`
- run `npm run dev` and open the url it shows
