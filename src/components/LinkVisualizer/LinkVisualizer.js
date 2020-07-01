import React, { Component } from 'react';
import './LinkVisualizer.css';

class LinkVisualizer extends Component {
  render() {
    return (
      <div className="link-visualizer-container">
          Link Visualizer: Where the link between actors will be vizualized with a WebGL library such as three.js or babylon.js
      </div>
    );
  }
}

export default LinkVisualizer;