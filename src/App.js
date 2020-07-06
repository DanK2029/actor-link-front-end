import React, { Component } from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ActorSearch from './components/ActorSearch/ActorSearch';
import Details from './components/Details/Details';
import LinkVisualizer from './components/LinkVisualizer/LinkVisualizer';
import './App.css';

class App extends Component {
  render() {
    return (
      <Container fluid className="no-padding-margin">
        <Row className="no-padding-margin">
          <Col className="no-padding">
            <ActorSearch></ActorSearch>
          </Col>
        </Row>
        <Row className="full-height no-padding-margin">
          <Col xs={12} sm={4} md={3} lg={2} className="full-height no-padding">
            <Details></Details>
          </Col>
          <Col xs={12} sm={8} md={9} lg={10} className="full-height no-padding">
            <LinkVisualizer></LinkVisualizer>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
