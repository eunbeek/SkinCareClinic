/* eslint react/prop-types: 0 */
import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      items: [
        { url: '/Customer', title: 'Home' },
        { url: `/Customer/Profile`, title: 'Profile' },
        { url: `/Customer/Balance/${localStorage.getItem('_id')}`, title: 'Balance' },
      ],
      _id: localStorage.getItem('_id'),
      authName: {},
    };
  }

  getCustomerProfile(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  componentDidMount() {
    this.getCustomerProfile(this.state._id).then((data) => {
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
        <div className="col-md-6" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">
            Profile
            <Button style={{ 'margin-left': '40px' }} variant="outline-info">
              <Link to={`/Customer/Edit/${this.state._id}`}>Edit</Link>
            </Button>
          </h2>
          <hr />
          <br />
          <Container class="col-md-12">
            <Form style={{ fontSize: '20px', textAlign: 'left' }}>
              <Form.Group as={Row}>
                <Form.Label column md={3}>
                  Name:
                </Form.Label>
                <Col sm={8}>
                  <Form.Label>
                    {this.state.profile.firstName} {this.state.profile.lastName}
                  </Form.Label>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  Email:
                </Form.Label>
                <Col sm={8}>
                  <Form.Label>{this.state.profile.email}</Form.Label>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  User Id:
                </Form.Label>
                <Col sm={8}>
                  <Form.Label>{this.state.profile.userID}</Form.Label>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={3}>
                  Address:
                </Form.Label>
                <Col sm={8}>
                  <Form.Label>{this.state.profile.address}</Form.Label>
                </Col>
              </Form.Group>
            </Form>
          </Container>
          <br />
        </div>
      </div>
    );
  }
}

export default CustomerProfile;
