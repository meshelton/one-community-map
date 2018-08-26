import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import {CensusMap} from "./CensusMap";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">One Community Map</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
          <CensusMap width={500} height={500}/>
      </div>
    );
  }
}

export default App;
