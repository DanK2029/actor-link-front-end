import React, { Component } from 'react';
import ActorSearch from './components/ActorSearch/ActorSearch';
import Details from './components/Details/Details';
import LinkVisualizer from './components/LinkVisualizer/LinkVisualizer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="component-container">
        <ActorSearch></ActorSearch>
        <Details></Details>
        <LinkVisualizer></LinkVisualizer>
      </div>
    );
  }
}

export default App;
