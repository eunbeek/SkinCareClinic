import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import PopUp from '../PopUp';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import moment from 'moment';

class ViewRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [
        { url: '/Request/', title: 'View All Requests' },
        { url: '/Request/Create', title: 'Create Request' },
        { url: '/Request/FAQ', title: 'FAQ' },
      ],
      children: 'Request',
      request: [],
      requestId: '',
      requestCategory: [],
      serviceCategory: [],
      completed: false,
      _id: localStorage.getItem('_id'),
      authName: {},
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleDelete = () => {
    this.deleteRequest().then(() => {
      this.getRequest(this.state.requestId).then((data) => {
        this.setState({
          request: data,
        });
      });
    });
    this.setState({
      show: false,
      request: null,
      completed: true,
    });
  };

  getRequest(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/request/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  deleteRequest() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/request/` + this.state.requestId, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
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
        authName: data.accountLevelId,
      });
    });
    this.getRequest(this.props.id).then((data) => {
      this.setState({
        request: data,
        requestId: data._id,
        serviceCategory: data.serviceCategory,
        requestCategory: data.requestCategory,
      });
    });
  }
  render() {
    if (this.state.authName == null) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }

    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Request',
          }}
        />
      );
    }
    const reqTitle = {
      'font-size': 'large',
      'font-weight': 'bold',
      color: 'black',
    };

    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Request Detail of {'"' + this.state.request.title + '"'}</h2>
          <br />
          <div className="contents" style={{ 'text-align': 'left', 'margin-right': '250px' }}>
            <Container>
              <Form style={{ 'padding-bottom': '80px' }}>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Title</Form.Label>
                  <Form.Control type="text" readOnly value={this.state.request.title} />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Contents</Form.Label>
                  <Form.Control as="textarea" readOnly value={this.state.request.contents} />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Category</Form.Label>
                  <Form.Control type="text" readOnly value={this.state.requestCategory.name} />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Involved Service</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={
                      this.state.serviceCategory == null ? '' : this.state.serviceCategory.name
                    }
                  />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Sent Date</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={moment(this.state.request.date).format('ll')}
                  />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Last Updated Time</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={moment(this.state.request.lastRequestTime).format('lll')}
                  />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Status</Form.Label>
                  <Form.Control type="text" readOnly value={this.state.request.status} />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Attachment</Form.Label> <br />
                  <Image
                    src={
                      process.env.REACT_APP_IMAGE_URL + '/file/' + this.state.request.attachedFile
                    }
                    alt=" No Attachment"
                  />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Answer</Form.Label>
                  <Form.Control
                    type="textarea"
                    value={this.state.request.answer}
                    readOnly
                  ></Form.Control>
                </Form.Group>
                <Container>
                  <Row>
                    <Col xs={9}></Col>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outline-secondary"
                        href={`/Request/Edit/${this.state.requestId}`}
                      >
                        Edit
                      </Button>
                    </Col>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        this.setState({
                          show: true,
                        });
                      }}
                    >
                      Delete
                    </Button>
                    <PopUp
                      show={this.state.show}
                      handleClose={this.hideModal}
                      handleDelete={this.handleDelete}
                      text={this.state.children}
                      btn1="Cancel"
                      btn2="Delete"
                    />
                  </Row>
                </Container>
              </Form>
            </Container>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

ViewRequest.propTypes = {
  id: PropTypes.string.isRequired,
};
export default ViewRequest;
