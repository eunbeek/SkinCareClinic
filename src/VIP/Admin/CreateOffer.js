import React from 'react';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import { Form, Row, Col, Container, Button, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { post } from 'axios';
import moment from 'moment';

class CreateOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      items: [
        { url: '/VIP/Admin', title: 'Special Offer' },
        { url: '/VIP/Admin/Manage', title: 'Offer Manage' },
        { url: '/VIP/Admin/Manage/Create', title: 'Create Offer' },
      ],
      // create offer data
      offer: {
        name: '',
        service: '',
        price: '',
        startDate: '',
        endDate: '',
        description: '',
        imageURL: String,
      },
      services: [],
      completed: false,
      file: null,
      imageSuccess: false,
      dateStatus: false,
      _id: localStorage.getItem('_id'),
      authName: {},
      fileFormat: false,
      nameNull: false,
      descNull: false,
      priceNull: false,
      priceIsDigit: false,
      sDateNull: false,
      eDateNull: false,
      serviceNull: false,
      priceValidation: '',
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

  handleSubmit(event) {
    event.preventDefault();
    this.state.offer.name == ''
      ? this.setState({ nameNull: true })
      : this.setState({ nameNull: false });
    this.state.offer.description == ''
      ? this.setState({ descNull: true })
      : this.setState({ descNull: false });
    if (this.state.offer.price == '') {
      this.setState({ priceNull: true });
      this.setState({ priceValidation: 'Price is required' });
    } else {
      if (isNaN(this.state.offer.price)) {
        this.setState({ priceNull: true });
        this.setState({ priceValidation: 'Price should be digit' });
      } else {
        this.setState({ priceNull: false });
      }
    }
    this.state.offer.startDate == ''
      ? this.setState({ sDateNull: true })
      : this.setState({ sDateNull: false });
    this.state.offer.endDate == ''
      ? this.setState({ eDateNull: true })
      : this.setState({ eDateNull: false });
    this.state.offer.service == ''
      ? this.setState({ serviceNull: true })
      : this.setState({ serviceNull: false });
    event.preventDefault();
    if (
      this.state.nameNull &&
      this.state.descNull &&
      this.state.priceNull &&
      this.state.priceIsDigit &&
      this.state.sDateNull &&
      this.state.eDateNull &&
      this.state.serviceNull
    ) {
      event.preventDefault();
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/create-offer`, {
        method: 'POST',
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
  }

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
      offer: {
        ...this.state.offer,
        name: event.target.value,
      },
      nameNull: false,
    }));
  }

  onDescriptionChange(event) {
    this.setState(() => ({
      offer: {
        ...this.state.offer,
        description: event.target.value,
      },
      descNull: false,
    }));
  }

  onPriceChange(event) {
    this.setState(() => ({
      offer: {
        ...this.state.offer,
        price: event.target.value,
      },
      priceNull: false,
      priceIsDigit: false,
    }));
  }

  validateDate = () => {
    const { endDate, startDate } = this.state.offer;
    let dateStatus = false;
    if (!moment(startDate).isSameOrBefore(endDate) && startDate && endDate) {
      dateStatus = true;
    }
    this.setState({ dateStatus });
  };
  onStartDateChange(event) {
    this.setState(
      () => ({
        sDateNull: false,
        offer: { ...this.state.offer, startDate: event.target.value },
      }),
      this.validateDate
    );
  }

  onEndDateChange(event) {
    this.setState(
      () => ({
        eDateNull: false,
        offer: { ...this.state.offer, endDate: event.target.value },
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
      this.getServices();
    });
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
          <h2 className="PageTitle">Create New Offer</h2>
          <br />
          <Container>
            <Form onSubmit={this.handleSubmit.bind(this)} method="POST">
              <Form.Group as={Row} controlId="name">
                <Form.Label column sm={2}>
                  Title:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Offer Title"
                    onChange={this.onNameChange.bind(this)}
                    isInvalid={this.state.nameNull}
                  />
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
                    <option>-- select service --</option>
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
              <Form.Group as={Row} controlId="description">
                <Form.Label column sm={2}>
                  Contents:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="textarea"
                    rows={3}
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
                    placeholder="120"
                    onChange={this.onPriceChange.bind(this)}
                    isInvalid={this.state.priceNull}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.priceValidation}
                  </Form.Control.Feedback>
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
                    placeholder="start date"
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
                    placeholder="end date"
                    onChange={this.onEndDateChange.bind(this)}
                    isInvalid={this.state.eDateNull || this.state.dateStatus}
                  />
                  <Form.Control.Feedback type="invalid">
                    Start-date should be before end-date
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
            </Form>
          </Container>
          <br />
        </div>
      </div>
    );
  }
}

export default CreateOffer;
