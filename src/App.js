import CablesPatch from './CablesPatch';
import './App.css';

function App() {
  return (
    <div className="App">
      <CablesPatch/>
      <CablesPatch patchDir={"/patch2/"} canvasId={"othercanvas"} patchOptions={{ "glCanvasResizeToWindow": false }}/>
    </div>
  );
}

export default App;
