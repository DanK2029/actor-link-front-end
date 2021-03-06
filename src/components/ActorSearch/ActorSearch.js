import React, { Component } from 'react';

import {Container, Col, Row, Navbar, Nav, Button, Form, FormControl} from 'react-bootstrap';

import './ActorSearch.css';

class ActorSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actor1: '',
      actor2: '',
      linkData: [],
    };
  }

  updateActor1 = (event) => {
    this.setState({actor1: event.target.value});
  };
  
  updateActor2 = (event) => {
    this.setState({actor2: event.target.value});
  };

  getLinkData = () => {
    console.log(`Actor 1: ${this.state.actor1}, Actor 2: ${this.state.actor2}`);
    this.props.setLinkData([
      {
        type: "ACTOR",
        name: "ACTOR 1",
        imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
      },
      {
        type: "MOVIE",
        name: "MOVIE 1",
        imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
      },
      {
        type: "ACTOR",
        name: "ACTOR 2",
        imageURL: "https://image.tmdb.org/t/p/w500/d0ZMdgMz1mVcWWctyF7sbymSlv4.jpg"
      },
    ]);
  }

  render() {
    return (
      <Container fluid className="no-padding">
        <Navbar>
          <Row>
            <Col xs={12} sm={4} md={3} lg={2}>
              <Navbar.Brand>Actor Link</Navbar.Brand>
            </Col>
            <Col xs={12} sm={8} md={9} lg={10}>
              <Nav>
                <Form inline className="full-width">
                  <FormControl type="text" placeholder="Actor 1..." className="search-box" 
                    onChange={this.updateActor1}/>
                  <FormControl type="text" placeholder="Actor 2..." className="search-box"
                    onChange={this.updateActor2}/>
                  <Button variant="outline-info" onClick={this.getLinkData}>Search</Button>
                </Form>
              </Nav>
            </Col>
          </Row>
        </Navbar>
      </Container>
    );
  }
}

export default ActorSearch;
