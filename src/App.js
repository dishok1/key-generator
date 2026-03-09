import "./App.css";
import KeyGenerator from "./Keygenerator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Key Generator</h1>
        {KeyGenerator()}
      </header>
    </div>
  );
}

export default App;
