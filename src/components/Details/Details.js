import React, { Component } from 'react';
import './Details.css';

class Details extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: props.selectedNode,
    }
  }

  render() {
    return (
      <div id="details-container">
        {
          this.props.selectedNode 
            ? this.props.selectedNode.name
            : 'No Name'
        }
      </div>
    );
  }
}

export default Details;