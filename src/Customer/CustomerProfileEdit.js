/* eslint react/prop-types: 0 */
import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class CustomerProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      completed: false,
      items: [
        { url: '/Customer', title: 'Home' },
        { url: `/Customer/Profile`, title: 'Profile' },
        { url: `/Customer/Balance/${localStorage.getItem('_id')}`, title: 'Balance' },
      ],
      tempPwd: '',
      pwdConfirmed: false,
      _id: localStorage.getItem('_id'),
      editProfile: {},
      authName: {},
      fNameStatus: false,
      lNameStatus: false,
      emailStatus: false,
      adStatus: false,
      passwordIsMoreThan8: true,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.passwordIsMoreThan8 || this.state.passwordConfirmedSame) {
      event.preventDefault();
    }

    fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`, {
      method: 'PUT',
      body: JSON.stringify(this.state.editProfile),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }

  onFirstNameChange(event) {
    this.setState(() => ({
      fNameStatus: false,
    }));

    if (event.target.value != '') {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          firstName: event.target.value,
        },
        editProfile: {
          ...this.state.editProfile,
          firstName: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          firstName: event.target.value,
        },
        fNameStatus: true,
      }));
    }
  }

  onLastNameChange(event) {
    this.setState(() => ({
      lNameStatus: false,
    }));

    if (event.target.value != '') {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          lastName: event.target.value,
        },
        editProfile: {
          ...this.state.editProfile,
          lastName: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          lastName: event.target.value,
        },
        lNameStatus: true,
      }));
    }
  }

  onEmailChange(event) {
    this.setState(() => ({
      emailStatus: false,
    }));

    if (event.target.value != '') {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          email: event.target.value,
        },
        editProfile: {
          ...this.state.editProfile,
          email: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          email: event.target.value,
        },
        emailStatus: true,
      }));
    }
  }

  onAddressChange(event) {
    this.setState(() => ({
      adStatus: false,
    }));

    if (event.target.value != '') {
      this.setState(() => ({
        profile: {
          ...this.state.profile,
          address: event.target.value,
        },
        editProfile: {
          ...this.state.editProfile,
          address: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        adStatus: true,
        profile: {
          ...this.state.profile,
          address: event.target.value,
        },
      }));
    }
  }

  onPasswordChange(event) {
    if (event.target.value.length < 8) {
      this.setState(() => ({
        tempPwd: event.target.value,
        passwordIsMoreThan8: false,
      }));
    } else {
      this.setState(() => ({
        tempPwd: event.target.value,
        passwordIsMoreThan8: true,
      }));
    }
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
  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          profile: data,
          authName: data.accountLevelId,
        });
      });
  }

  render() {
    if (this.state.authName == null) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <Container>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <h2 className="PageTitle">Edit Profile</h2>
              <br />
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  First Name:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.firstName}
                    onChange={this.onFirstNameChange.bind(this)}
                    isInvalid={this.state.fNameStatus}
                  />
                  <Form.Control.Feedback type="invalid">
                    First Name is required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Last Name:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.lastName}
                    onChange={this.onLastNameChange.bind(this)}
                    isInvalid={this.state.lNameStatus}
                  />
                  <Form.Control.Feedback type="invalid">
                    Last Name is required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Password:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="password"
                    onChange={this.onPasswordChange.bind(this)}
                    isInvalid={!this.state.passwordIsMoreThan8}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password length must be longer than 8
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Confirm Password:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="password"
                    onChange={this.onConfirmPasswordChange.bind(this)}
                    isInvalid={this.state.pwdConfirmed}
                  />
                  <Form.Control.Feedback type="invalid">PASSWORD NOT MATCHED</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Email Address:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="email"
                    value={this.state.profile.email}
                    onChange={this.onEmailChange.bind(this)}
                    isInvalid={this.state.emailStatus}
                  />
                  <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Address:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    value={this.state.profile.address}
                    onChange={this.onAddressChange.bind(this)}
                    isInvalid={this.state.adStatus}
                  />
                  <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col xs={2}></Col>
                <Col>
                  <Link to={`/Customer/Profile`}>
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

export default CustomerProfileEdit;
