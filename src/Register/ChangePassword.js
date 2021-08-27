import React, { Component } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../App.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      tempPwd: '',
      pwdConfirmed: false,
      _id: localStorage.getItem('_id'),
      editProfile: {},
      authName: {},
      isChanged: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`, {
      method: 'PUT',
      body: JSON.stringify(this.state.editProfile),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        response.json();
        this.setState({ isChanged: true });
      })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }

  onPasswordChange(event) {
    this.setState(() => ({
      tempPwd: event.target.value,
    }));
  }

  onConfirmPasswordChange(event) {
    this.setState(() => ({
      pwdConfirmed: false,
    }));

    if (this.state.tempPwd == event.target.value) {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          password: event.target.value,
        },
        editProfile: {
          ...this.state.editProfile,
          password: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        pwdConfirmed: true,
      }));
    }
  }

  render() {
    if (this.state.authName == null) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }

    if (this.state.isChanged) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Register/login',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-8" style={{ 'margin-left': '600px' }}>
          <Container>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <h2 className="PageTitle">Change Password</h2>
              <br />
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Password:
                </Form.Label>
                <Col sm={3}>
                  <Form.Control type="password" onChange={this.onPasswordChange.bind(this)} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Confirm Password:
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="password"
                    onChange={this.onConfirmPasswordChange.bind(this)}
                    isInvalid={this.state.pwdConfirmed}
                  />
                  <Form.Control.Feedback type="invalid">PASSWORD NOT MATCHED</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} style={{ 'margin-right': '350px' }}>
                <Col>
                  <Link to={`./login`}>
                    <Button variant="outline-info">Cancel</Button>
                  </Link>
                  &nbsp;
                  <Button type="submit" variant="outline-info">
                    Save
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Container>
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default ChangePassword;
