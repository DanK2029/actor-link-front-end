import React, { Component } from 'react';
import './ActorSearch.css';

class ActorSearch extends Component {
  render() {
    return (
      <div className="actor-search-container">
          Actor Search: Where the user can search for two actors by name to get the movie-costar link between them.
      </div>
    );
  }
}

export default ActorSearch;