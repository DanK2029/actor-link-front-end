import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'
import './ActorSearch.css';

class ActorSearch extends Component {
  render() {
    return (
      <Container fluid className="no-padding">
        <Navbar variant="dark" bg="dark">
          <Row>
            <Col xs={12} sm={4} md={3} lg={2}>
              <Navbar.Brand>Actor Link</Navbar.Brand>
            </Col>
            <Col xs={12} sm={8} md={9} lg={10}>
              <Nav>
                <Form inline className="full-width">
                  <FormControl type="text" placeholder="Actor 1..." className="search-box"/>
                  <FormControl type="text" placeholder="Actor 2..." className="search-box"/>
                  <Button variant="outline-info">Search</Button>
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
