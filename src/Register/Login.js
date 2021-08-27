import React, { Component } from 'react';
import '../App.css';
import { Form, Row, Col, Container, Button, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    const loggedIn = localStorage.getItem('isLogin');
    this.state = {
      account: {
        userID: '',
        password: '',
      },
      loggedIn,
      showError: false,
      errorObject: { isError: true },
    };
  }

  onAccountInputChange = (evt) => {
    this.setState(
      {
        ...this.state,
        account: {
          ...this.state.account,
          [evt.target.name]: evt.target.value,
        },
      },
      this.isValid
    );
  };

  isValid = () => {
    const { userID, password } = this.state.account;
    const errorObject = { isError: false, userID: '', password: '' };
    if (!userID) {
      errorObject.isError = true;
      errorObject.userID = 'User ID is required';
    }

    if (!password) {
      errorObject.isError = true;
      errorObject.password = 'Password is required';
    }

    this.setState({
      errorObject,
    });
  };
  refreshPage = () => {
    window.location.reload();
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { errorObject } = this.state;
    this.setState({ showError: true });
    if (errorObject.isError) {
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, this.state.account)
      .then((res) => {
        if (res.data.loginSuccess) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('_id', res.data._id);
          localStorage.setItem('isLogin', res.data.loginSuccess);
          this.refreshPage();
          this.props.history.push('/');
        } else {
          this.setState({ errorObject: { ...errorObject, login: res.data.message } });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { errorObject, showError } = this.state;
    if (this.state.loggedIn) {
      return (
        <Redirect
          push
          to={{
            pathname: '/',
          }}
          refresh="true"
        />
      );
    }
    return (
      <>
        <div className="row">
          <div className="col-md-8" style={{ margin: '0 auto' }}>
            <h2 className="PageTitle" style={{ textAlign: 'center' }}>
              Log In
            </h2>
            <br />
            <Container>
              <Form onSubmit={this.handleSubmit} method="POST">
                <Form.Group as={Row} style={{ justifyContent: 'center' }}>
                  <Form.Label column sm={2}>
                    ID:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      placeholder="Enter ID"
                      name="userID"
                      onChange={this.onAccountInputChange}
                      isInvalid={showError && errorObject.userID}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errorObject.userID}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} style={{ justifyContent: 'center' }}>
                  <Form.Label column sm={2}>
                    Password:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      onChange={this.onAccountInputChange}
                      isInvalid={showError && errorObject.password}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errorObject.password}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} style={{ justifyContent: 'center' }}>
                  <Row>
                    <Col>
                      <Button variant="outline-secondary" href="/VIP/Admin/Manage">
                        Cancel
                      </Button>
                    </Col>
                    <Col md="auto">
                      <Button variant="outline-info" type="submit" disabled={errorObject.isError}>
                        Log in
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Container>
            <div style={{ marginRight: '40px' }}>
              <div className="custom-control custom-checkbox" style={{ marginRight: '110px' }}>
                <span style={{ marginLeft: '145px' }}>
                  No account?<a href="./TermsAndConditions"> Sign up </a>
                </span>
              </div>
            </div>
            <div className="col-md-4" style={{ marginLeft: '290px' }}>
              <p className="forgot-password text-right">
                <a href="./ForgotID">Forgot ID?</a> /{' '}
                <a href="./ForgotPassword">Forgot Password?</a>
              </p>
            </div>
            {showError && errorObject.login && (
              <Alert variant={'danger'}>{errorObject.login}</Alert>
            )}
            <br />
            <br /> <br />
            <br />
          </div>
          <br />
          <br />
        </div>
      </>
    );
  }
}
export default withRouter(Login);
