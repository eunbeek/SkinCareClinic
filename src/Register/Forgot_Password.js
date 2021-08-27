import React, { Component } from 'react';
import '../App.css';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import axios from 'axios';

class Forgot_Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {
        userID: String,
        email: String,
      },
      isFind: false,
    };
  }
  onEmailCheck(event) {
    this.setState(() => ({
      account: {
        ...this.state.account,
        email: event.target.value,
      },
    }));
  }

  onUserIDCheck(event) {
    this.setState(() => ({
      account: {
        ...this.state.account,
        userID: event.target.value,
      },
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/forgotPassword`, this.state.account)
      .then((res) => {
        localStorage.setItem('_id', res.data._id);
        if (res.data.loginSuccess) {
          this.setState({ isFind: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.isFind) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Register/FindPassword',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-8" style={{ 'margin-left': '350px' }}>
          <h2 className="PageTitle" style={{ 'margin-left': '380px' }}>
            Forgot Password
          </h2>
          <br />
          <Container style={{ 'margin-left': '250px' }}>
            <Form onSubmit={this.handleSubmit.bind(this)} method="POST">
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Email:
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email"
                    onChange={this.onEmailCheck.bind(this)}
                  ></Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  User ID
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="text"
                    placeholder="Enter User ID"
                    onChange={this.onUserIDCheck.bind(this)}
                  ></Form.Control>
                </Col>
              </Form.Group>

              <Form.Group style={{ marginLeft: '250px' }} as={Row}>
                <Row>
                  <Col>
                    <Button variant="outline-secondary" href="./login">
                      Cancel
                    </Button>
                  </Col>
                  <Col md="auto">
                    <Button variant="outline-info" type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Container>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default Forgot_Password;
