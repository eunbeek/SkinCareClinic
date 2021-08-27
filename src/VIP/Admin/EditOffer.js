import React from 'react';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import { Form, Row, Col, Container, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { post } from 'axios';
import moment from 'moment';

class EditOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      items: [
        { url: '/VIP/Admin', title: 'Special Offer' },
        { url: '/VIP/Admin/Manage', title: 'Offer Manage' },
        { url: '/VIP/Admin/Manage/Create', title: 'Create Offer' },
      ],
      children: 'Offer',
      offer: {},
      services: [],
      completed: false,
      file: null,
      imageSuccess: false,
      dateStatus: false,
      _id: localStorage.getItem('_id'),
      authName: {},
      nameNull: false,
      descNull: false,
      priceNull: false,
      fileFormat: false,
      sDateNull: false,
      eDateNull: false,
      serviceNull: false,
    };
    this.imageShow = this.imageShow.bind(this);
    this.imageHide = this.imageHide.bind(this);
    this.fileCheck = this.fileCheck.bind(this);
  }
  imageShow = () => {
    this.setState({
      imageSuccess: true,
    });
  };

  imageHide = () => {
    this.setState({
      imageSuccess: false,
    });
  };

  fileCheck = () => {
    this.setState({
      fileFormat: false,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      nameNull: false,
      descNull: false,
      priceNull: false,
    });
    if (
      this.state.offer.name == '' ||
      this.state.offer.description == '' ||
      this.state.offer.price == '' ||
      this.state.eDateNull ||
      this.state.sDateNull ||
      this.state.dateStatus
    ) {
      this.state.offer.name == ''
        ? this.setState({ nameNull: true })
        : this.setState({ nameNull: false });
      this.state.offer.description == ''
        ? this.setState({ descNull: true })
        : this.setState({ descNull: false });
      this.state.offer.price == ''
        ? this.setState({ priceNull: true })
        : this.setState({ priceNull: false });
      this.state.offer.service == '0'
        ? this.setState({ serviceNull: true })
        : this.setState({ serviceNull: false });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/offer/${this.props.id}`, {
        method: 'PUT',
        body: JSON.stringify(this.state.offer),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => this.setState({ completed: true }))
        .catch((err) => console.log(err));
    }
  };

  onFormSubmit(event) {
    var fileValue = event.target.files[0].name;
    var extension = fileValue.split('.').pop();

    if (
      extension == 'jpg' ||
      extension == 'png' ||
      extension == 'gif' ||
      extension == 'pdf' ||
      extension == 'txt'
    ) {
      this.setState({
        file: event.target.files[0],
      });
    } else {
      this.setState({
        fileFormat: true,
      });
    }
  }

  fileUpload() {
    if (!this.state.fileFormat) {
      const url = process.env.REACT_APP_IMAGE_URL + '/upload';
      const formData = new FormData();
      formData.append('file', this.state.file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      post(url, formData, config)
        .then((data) => {
          var tempData = JSON.stringify(data.data.fileName).replace('"', '').replace('"', '');
          this.setState(() => ({
            offer: {
              ...this.state.offer,
              imageURL: tempData,
            },
          }));
        })
        .then(() => {
          this.setState({
            imageSuccess: true,
          });
        })
        .catch(() => {
          this.setState({
            imageSuccess: false,
            fileFormat: true,
          });
        });
    } else {
      this.setState({
        fileFormat: true,
      });
    }
  }

  onNameChange(event) {
    this.setState(() => ({
      nameNull: false,
    }));
    if (event.target.value != '') {
      this.setState(() => ({
        isSave: false,
        offer: {
          ...this.state.offer,
          name: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        isSave: true,
        offer: {
          ...this.state.offer,
          name: event.target.value,
        },
        nameNull: true,
      }));
    }
  }

  onDescriptionChange(event) {
    this.setState(() => ({
      descNull: false,
    }));
    if (event.target.value != '') {
      this.setState(() => ({
        offer: {
          ...this.state.offer,
          description: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        offer: {
          ...this.state.offer,
          description: event.target.value,
        },
        descNull: true,
      }));
    }
  }

  onPriceChange(event) {
    this.setState(() => ({
      priceNull: false,
    }));
    if (event.target.value != '') {
      this.setState(() => ({
        offer: {
          ...this.state.offer,
          price: event.target.value,
        },
      }));
    } else {
      this.setState(() => ({
        offer: {
          ...this.state.offer,
          price: event.target.value,
        },
        priceNull: true,
      }));
    }
  }

  validateDate = () => {
    const { endDate, startDate } = this.state.offer;
    let dateStatus = false,
      sDateNull = false,
      eDateNull = false;
    if (!moment(startDate).isSameOrBefore(endDate) && startDate && endDate) {
      dateStatus = true;
    }

    if (!startDate) {
      sDateNull = true;
    }

    if (!endDate) {
      eDateNull = true;
    }
    this.setState({ dateStatus, sDateNull, eDateNull });
  };

  onStartDateChange(event) {
    this.setState(
      () => ({
        ...this.state,
        offer: {
          ...this.state.offer,
          startDate: event.target.value,
        },
      }),
      this.validateDate
    );
  }

  onEndDateChange(event) {
    this.setState(
      () => ({
        ...this.state,
        offer: {
          ...this.state.offer,
          endDate: event.target.value,
        },
      }),
      this.validateDate
    );
  }

  onServiceChange(event) {
    this.setState(() => ({
      offer: {
        ...this.state.offer,
        service: event.target.value,
      },
      serviceNull: false,
    }));
  }

  getCustomerProfile() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  getServices() {
    fetch(`${process.env.REACT_APP_API_URL}/services`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          services: data,
        });
      });
  }

  componentDidMount() {
    this.getCustomerProfile(this.state._id).then((data) => {
      this.setState({
        authName: data.accountLevelId,
      });
    });
    fetch(`${process.env.REACT_APP_API_URL}/offer/${this.props.id}`)
      .then((response) => response.json())
      .then((data) => {
        const startDate = data.startDate.split('T')[0];
        const endDate = data.endDate.split('T')[0];
        this.setState({
          offer: {
            ...data,
            startDate,
            endDate,
          },
        });
      });
    this.getServices();
  }

  render() {
    if (
      this.state.authName == null ||
      this.state.authName._id == '60371ad3fda1af6510e75e3a' ||
      this.state.authName._id == '60371ae9fda1af6510e75e3b'
    ) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: '/VIP/Admin/Manage',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Edit Offer</h2>
          <br />
          <Container>
            <Form onSubmit={this.handleSubmit} method="PUT">
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Title:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Offer Title"
                    value={this.state.offer.name}
                    onChange={this.onNameChange.bind(this)}
                    isInvalid={this.state.nameNull}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">Title is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Service:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    inline
                    as="select"
                    onChange={this.onServiceChange.bind(this)}
                    isInvalid={this.state.serviceNull}
                  >
                    <option value="0">-- select service --</option>
                    {this.state.services.map((result) => (
                      // eslint-disable-next-line react/jsx-key
                      <option key={result._id} value={result._id}>
                        {result.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">Service is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Contents:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={this.state.offer.description}
                    onChange={this.onDescriptionChange.bind(this)}
                    isInvalid={this.state.descNull}
                  />
                  <Form.Control.Feedback type="invalid">Content is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Price:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    rows={3}
                    value={this.state.offer.price}
                    onChange={this.onPriceChange.bind(this)}
                    isInvalid={this.state.priceNull}
                  />
                  <Form.Control.Feedback type="invalid">Price is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} inline>
                <Form.Label column sm={2}>
                  Active Date
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    controlId="startDate"
                    type="date"
                    value={this.state.offer.startDate}
                    onChange={this.onStartDateChange.bind(this)}
                    isInvalid={this.state.sDateNull}
                  />
                  <Form.Control.Feedback type="invalid">
                    Start date is required
                  </Form.Control.Feedback>
                </Col>
                <Col sm={3}>
                  <Form.Control
                    controlId="endDate"
                    type="date"
                    value={this.state.offer.endDate}
                    onChange={this.onEndDateChange.bind(this)}
                    isInvalid={this.state.eDateNull || this.state.dateStatus}
                  />
                  <Form.Control.Feedback type="invalid">
                    start-date should be before end-date
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Attach File:
                </Form.Label>
                <Form.File type="file" onChange={this.onFormSubmit.bind(this)} />
                <Modal show={this.state.fileFormat} onHide={this.fileCheck}>
                  <Modal.Header closeButton>
                    <Modal.Title>Image Upload Result</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Only .jpg .png .gif .pdf .txt file type is allowed</p>
                  </Modal.Body>
                </Modal>
                <Button variant="outline-secondary" onClick={this.fileUpload.bind(this)}>
                  Upload
                </Button>
                <Modal show={this.state.imageSuccess} onHide={this.imageHide}>
                  <Modal.Header closeButton>
                    <Modal.Title>Image Upload Result</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Image Upload Success</p>
                  </Modal.Body>
                </Modal>
              </Form.Group>
              <Container>
                <Row>
                  <Col xs={6}></Col>
                  <Col md="auto">
                    <Button variant="outline-secondary" href="/VIP/Admin/Manage">
                      Cancel
                    </Button>
                  </Col>
                  <Button type="submit" variant="outline-info">
                    Save
                  </Button>
                </Row>
                <br />
              </Container>
              <br />
              <br />
            </Form>
          </Container>
          <br />
        </div>
      </div>
    );
  }
}

EditOffer.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditOffer;
