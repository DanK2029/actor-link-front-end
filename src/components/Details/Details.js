import React, { Component } from 'react';
import './Details.css';

class Details extends Component {
  render() {
    return (
      <div className="details-container">
          Details: where more detailed information about actors or movies will be displayed. The user can click/select an actor/movie in the visualizer to change the information being displayed here.
      </div>
    );
  }
}

export default Details;