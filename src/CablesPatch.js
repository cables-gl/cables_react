import React, {Component} from 'react';

/* global CABLES */

export default class CablesPatch extends Component {

  constructor(props) {
    super(props);
    this.canvasId = props.canvasId || "glcanvas";
    this.patchDir = props.patchDir || process.env.PUBLIC_URL + '/patch/';
    this.patchOptions = {
      'prefixAssetPath': this.patchDir,
      'jsPath': this.patchDir + '/js/',
      'glCanvasId': this.canvasId,
      'glCanvasResizeToWindow': true,
      'canvas': {'alpha': true, 'premultipliedAlpha': true},
      ...props.patchOptions
    }
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = this.patchDir + '/js/patch.js';
    script.async = true;
    script.onload = this._initPatch.bind(this);
    document.body.appendChild(script);
  }

  render() {
    const canvasId = this.patchOptions.glCanvasId;
    return (
        <canvas id={canvasId} tabIndex="1"></canvas>
    );
  }

  _initPatch() {
    const patchOptions = this.patchOptions;
    if (!patchOptions.patch) patchOptions.patch = CABLES.exportedPatch;
    if (!patchOptions.onPatchLoaded) patchOptions.onPatchLoaded = this._patchInitialized.bind(this);
    if (!patchOptions.onFinishedLoading) patchOptions.onFinishedLoading = this._patchFinishedLoading.bind(this);
    console.log("OPTIONS ARE", patchOptions);
    CABLES.patch = new CABLES.Patch(patchOptions);
  }

  _patchInitialized(patch) {
    // You can now access the patch object (patch), register variable watchers and so on
    console.log(this.patchDir + ' initialized');
  }

  _patchFinishedLoading(patch) {
    // The patch is ready now, all assets have been loaded
    console.log(this.patchDir + ' finished loading');
  }

}
