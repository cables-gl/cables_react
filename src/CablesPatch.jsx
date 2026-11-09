import { useEffect, useRef } from "react";
import { startCablesPatch } from "./cablesPatch.js";

export default function CablesPatch({ patchDir = import.meta.env.BASE_URL + "patch/", prefixAssetPath, assetPath, jsPath, libs, patchOptions, ...props })
{
    const container = useRef(null);
    const options = useRef({ libs, patchOptions });
    options.current = { libs, patchOptions };

    useEffect(() =>
    {
        return startCablesPatch(container.current, { patchDir, prefixAssetPath, assetPath, jsPath, ...options.current });
    }, [patchDir, prefixAssetPath, assetPath, jsPath]);

    return <div ref={container} {...props} />;
}
