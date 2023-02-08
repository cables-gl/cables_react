# cables.gl react integration and component

small component to load one or more [cables.gl](https://cables.gl/) patches in your [react](https://reactjs.org/) app

the app was created using [create-react-app](https://create-react-app.dev/), check `src/App.js` for an example on
how to load two patches, with default values and custom ones. `src/CablesPatch.js` contains the component.

to update your patches, put your exported files into `public/patch` or configure a different path when using the
component.

**make sure to export as "single javascript file"**

## requirements

* nodejs and npm in a current version

## installation

* check out this repository
* run `npm install`
* run `npm run start`
* browser will open and show two patches overlaying
