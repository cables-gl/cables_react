/* global CABLES */

const scripts = {};
const exports = {};
let queue = Promise.resolve();

function addScript(key, src)
{
    if (!scripts[key])
    {
        scripts[key] = new Promise((resolve, reject) =>
        {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = () => { reject(new Error("cables: could not load " + src)); };
            document.head.appendChild(script);
        });
    }
    return scripts[key];
}

function addModule(name, src)
{
    if (!scripts[name])
    {
        scripts[name] = import(/* @vite-ignore */ src).then((module) => { window[name] = module; });
    }
    return scripts[name];
}

async function loadExport(patchDir, libs, assetPath, jsPath)
{
    const base = new URL(patchDir.endsWith("/") ? patchDir : patchDir + "/", document.baseURI);
    const jsBase = new URL(jsPath && !jsPath.endsWith("/") ? jsPath + "/" : jsPath, base);
    const assetBase = new URL(assetPath && !assetPath.endsWith("/") ? assetPath + "/" : assetPath, base);

    for (const lib of libs)
    {
        if (typeof lib === "string") await addScript(lib, new URL(lib, base).href);
        else await addModule(lib.export, new URL(lib.src, base).href);
    }

    const exportedBefore = Object.keys((window.CABLES && CABLES.exportedPatches) || {});
    const patchJs = new URL("patch.js", jsBase).href;
    const notCombined = "cables: could not load " + patchJs + ", make sure to export the patch with \"single javascript file\"";
    await addScript(patchJs, patchJs).catch(() => { throw new Error(notCombined); });
    if (!window.CABLES || !CABLES.Patch) throw new Error(notCombined);
    const added = Object.keys(CABLES.exportedPatches || {}).filter((id) => { return !exportedBefore.includes(id); });
    if (!added.length && !CABLES.exportedPatch) throw new Error(notCombined);

    return {
        "patch": added.length ? CABLES.exportedPatches[added[0]] : CABLES.exportedPatch,
        "prefixAssetPath": base.href,
        "assetPath": assetBase.href,
        "jsPath": jsBase.href
    };
}

export function loadCablesExport(patchDir, libs = [], assetPath = "assets/", jsPath = "js/")
{
    const key = patchDir + "|" + assetPath + "|" + jsPath;
    if (!exports[key])
    {
        exports[key] = queue.then(() => { return loadExport(patchDir, libs, assetPath, jsPath); });
        queue = exports[key].catch(() => {});
    }
    return exports[key];
}

export function startCablesPatch(container, { patchDir, libs, assetPath, jsPath, patchOptions = {} })
{
    const canvas = document.createElement("canvas");
    canvas.tabIndex = 1;
    canvas.style.cssText = "display:block;width:100%;height:100%;outline:0;";
    container.appendChild(canvas);

    let patch = null;
    let stopped = false;
    const resizeObserver = new ResizeObserver(() =>
    {
        const cg = patch && (patch.cgl || patch.cgp);
        if (cg) cg.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    loadCablesExport(patchDir, libs, assetPath, jsPath).then((config) =>
    {
        if (stopped) return;
        patch = new CABLES.Patch({
            ...config,
            "glCanvas": canvas,
            "canvas": { "alpha": true, "premultipliedAlpha": true },
            ...patchOptions
        });
    }).catch((e) =>
    {
        if (stopped) return;
        if (patchOptions.onError) patchOptions.onError("cables", e);
        else console.error(e);
    });

    return () =>
    {
        stopped = true;
        resizeObserver.disconnect();
        if (patch) patch.dispose();
        canvas.remove();
    };
}
