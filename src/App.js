import React from 'react';
import { level1 } from './model/Puzzle'
import { level2 } from './model/Puzzle'
import { level3 } from './model/Puzzle'
import { redrawCanvas} from './boundary/boundary.js'
import { Model } from './model/Model.js'
import { layout, Layout } from './model/Layout'


function App() {
  const [model, setModel] = React.useState(new Model(level1));
  const [redraw, forceRedraw] = React.useState(0);       // used to conveniently request redraw after model change
  const appRef = React.useRef(null);      // need to be able to refer to App
  const canvasRef = React.useRef(null);   // need to be able to refer to Canvas

  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect (() => {

    redrawCanvas(model, canvasRef.current)
  }, [model, redraw])   // arguments that determine when to refresh

  return (
    <main style ={layout.Appmain} ref={appRef}>
      <canvas tabIndex="1"  
        className="App-canvas"
        ref={canvasRef}
        width  = {layout.canvas.width}
        height = {layout.canvas.height} 
        />
      <label style = {layout.moveCount}>{"Number of moves: " + model.numMoves} </label>
      <label style = {layout.ninjaseKey}>{"Key that Ninjase is holding: "}</label>
      <div style = {layout.buttons}>
      <button style={layout.upbutton}>&#8593;</button>
      <button style={layout.leftbutton}>&#8592;</button>
      <button style ={layout.rightbutton}>&#8594;</button>
      <button style={layout.downbutton}>&#8595;</button>
      <button style={layout.pickUpKeyButton}>&#8711;</button>
      <button style={layout.resetButton}>Reset</button>
      <button style={layout.level1Button}>Level One</button>
      <button style={layout.level2Button}>Level Two</button>
      <button style={layout.level3Button}>Level Three</button>

      </div>
      
    </main>
  );
}

export default App;
