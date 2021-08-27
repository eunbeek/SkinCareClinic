import React, { Component } from 'react';
import '../App.css';
import { Form, Row, Col, Container, Button, Alert } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router';
import axios from 'axios';

const ACCOUNT_LEVEL_ID = '60371ad3fda1af6510e75e3a';
//eslint-disable-next-line
const EMAIL_REGEX = /\S+@\S+\.\S+/;
// const PHONE_NUMBER_REGEX = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
const PHONE_NUMBER_REGEX = /^[1-9]\d{2}-\d{3}-\d{4}$/; //000-000-0000

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {
        userID: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        accountLevelId: ACCOUNT_LEVEL_ID,
        balanceHistory: String,
      },
      showError: false,
      errorObject: { isError: true },
      completed: false,
    };
  }

  isValid = () => {
    const {
      userID,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      email,
      address,
    } = this.state.account;
    const errorObject = {
      isError: false,
      userID: '',
      password: '',
      confirmPassword: '',
      passwordInvalid: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
    };

    // - error message should displayed if user id is null
    if (!userID) {
      errorObject.isError = true;
      errorObject.userID = 'User ID is required';
    }
    // - error message should displayed if user id is less than 6 character
    if (userID.length < 6) {
      errorObject.isError = true;
      errorObject.userID = 'User ID should be more than 6 characters';
    }
    // - error message should displayed if password is null
    if (!password) {
      errorObject.isError = true;
      errorObject.password = 'Password is required';
    }
    // - error message should displayed if password is less than 8 character
    if (password.length < 8) {
      errorObject.isError = true;
      errorObject.password = 'Password should be more than 8 characters';
    }

    if (confirmPassword && password != confirmPassword) {
      errorObject.isError = true;
      errorObject.passwordInvalid = "Password doesn't match";
    }
    if (!confirmPassword) {
      errorObject.isError = true;
      errorObject.confirmPassword = 'Confirm password is required';
    }
    // - error message should displayed if first name is null
    if (!firstName) {
      errorObject.isError = true;
      errorObject.firstName = 'First name is required';
    }
    // - error message should displayed if last name is null
    if (!lastName) {
      errorObject.isError = true;
      errorObject.lastName = 'Last name is required';
    }

    // - error message should displayed if phone number is in invalid format(000-000-0000), no more than 12 character
    if (phone.length > 12 || !PHONE_NUMBER_REGEX.test(phone)) {
      errorObject.isError = true;
      errorObject.phone = 'Phone number format is incorrect (000-000-0000)';
    }

    // - error message should displayed if phone number is null
    if (!phone) {
      errorObject.isError = true;
      errorObject.phone = 'Phone number is required';
    }

    // - error message should displayed if email is null
    if (!email) {
      errorObject.isError = true;
      errorObject.email = 'Email is required';
    }

    // - error message should displayed if email is in invalid format
    if (email && !EMAIL_REGEX.test(email)) {
      errorObject.isError = true;
      errorObject.email = 'Email format is incorrect';
    }
    // - error message should displayed if address is null
    if (!address) {
      errorObject.isError = true;
      errorObject.address = 'Address is required';
    }

    this.setState({ errorObject });
  };

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

  handleSubmit = (event) => {
    event.preventDefault();
    const { errorObject } = this.state;
    this.setState({ showError: true });
    if (errorObject.isError) {
      this.isValid();
      return true;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/create-account`, this.state.account)
      .then((res) => {
        if (!res.data.success) {
          this.setState({ errorObject: { ...errorObject, signup: res.data.message } });
          return;
        }
        this.setState({ completed: true });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { showError, errorObject } = this.state;
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Register/SignupSuccess',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-8" style={{ margin: '0 auto' }}>
          <h2 className="PageTitle" style={{ textAlign: 'center' }}>
            Sign-up Form
          </h2>
          <br />
          <Container>
            <Form onSubmit={this.handleSubmit} method="POST">
              <Form.Group as={Row} controlId="userID" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  User ID:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    name="userID"
                    minLength="6"
                    placeholder="Enter user ID"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.userID}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{errorObject.userID}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="password" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  Password:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="password"
                    name="password"
                    minLength="8"
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
                <Form.Label column sm={2}>
                  Confirm Password:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter the Password"
                    onChange={this.onAccountInputChange}
                    isInvalid={
                      errorObject.passwordInvalid || (showError && errorObject.confirmPassword)
                    }
                  ></Form.Control>
                  <Form.Control.Feedback type={'invalid'}>
                    {errorObject.confirmPassword || errorObject.passwordInvalid}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="firstName" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  First Name:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter First name"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.firstName}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errorObject.firstName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="lastName" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  Last Name:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter Last name"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorObject.lastName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="phone" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  Phone Number:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="tel"
                    name="phone"
                    maxLength="12"
                    placeholder="000-000-0000"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.phone}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{errorObject.phone}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="email" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  Email address:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter E-mail address"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.email}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{errorObject.email}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="address" style={{ justifyContent: 'center' }}>
                <Form.Label column sm={2}>
                  Address:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    onChange={this.onAccountInputChange}
                    isInvalid={showError && errorObject.address}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errorObject.address}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} style={{ justifyContent: 'center' }}>
                <span>
                  Already registered?
                  <a href="./Login"> sign in</a>
                </span>
              </Form.Group>

              <Form.Group as={Row} style={{ justifyContent: 'center' }}>
                <Row>
                  <Col>
                    <Button
                      className="page-link btn btn-outline-info"
                      style={{ marginRight: '300px' }}
                      href="./TermsAndConditions"
                    >
                      ❮ Previous
                    </Button>
                  </Col>
                  <Col md="auto">
                    <Button className="page-link btn btn-outline-info" type="submit">
                      Next ❯
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Container>

          {showError && errorObject.signup && (
            <Alert variant={'danger'}>{errorObject.signup}</Alert>
          )}
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);
