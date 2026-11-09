import CablesPatch from "./CablesPatch.jsx";

export default function App()
{
    return (
        <CablesPatch
            className="patch"
            patchOptions={{
                "onPatchLoaded": (patch) => { console.log("patch initialized", patch); },
                "onFinishedLoading": (patch) => { console.log("patch finished loading", patch); }
            }}
        />
    );
}
