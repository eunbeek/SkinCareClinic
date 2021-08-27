import React from 'react';
import '../../App.css';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import SideBar from '../../SideBar/SideBar';
import styles from '../../app.module.css';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';

class LeaveMessageToAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment/Admin', title: 'View All Appointments' },
        { url: '/Appointment/Admin/Create', title: 'New Appointment' },
      ],
      saveModal: false,
      title: 'Message sent!',
      savedBackLink: '/Appointment/Admin',
      button: 'Back To Appointment',
      appointment: [],
      customer: [],
      schedule: [],
      time: [],
      date: [],
      service: [],
      staff: [],
      completed: false,
    };
    this.showSave = this.showSave.bind(this);
    this.hideSave = this.hideSave.bind(this);
    this.getAppointment = this.getAppointment.bind(this);
  }

  showSave = () => {
    this.setState({ saveModal: true });
  };

  hideSave = () => {
    this.setState({ saveModal: false });
  };

  handleSubmit(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`, {
      method: 'PUT',
      body: JSON.stringify(this.state.appointment),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => this.setState({ completed: true }))
      .catch((err) => console.log(err));
  }

  onMessageChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        message: event.target.value,
      },
    }));
  }

  getAppointment = () => {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  };
  componentDidMount() {
    document.title = 'Leave Message to Appointment | Body Contouring Clinic';

    this.getAppointment().then((data) => {
      this.setState({
        appointment: data,
        customer: data.customer.account,
        schedule: data.schedule,
        time: data.schedule.time,
        date: data.schedule.date,
        staff: data.schedule.staff.account,
        service: data.service,
      });
    });
  }

  render() {
    const staffFullName = this.state.staff.firstName + ' ' + this.state.staff.lastName;
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: `/Appointment/Admin/Appointment/${this.props.id}`,
          }}
        />
      );
    }
    return (
      <>
        <br />
        <br />
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-6">
            <h2 className={styles.appointmentTitle}>Leave Message</h2>
            <Container>
              <Row>
                <Col></Col>
                <Col xs={8}>
                  <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Services:
                      </Form.Label>
                      <Col sm="8" style={{ marginLeft: '0px' }} className="row">
                        <Form.Control
                          inline
                          disabled
                          placeholder="Green Peel"
                          value={this.state.service.name}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Technician:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control disabled placeholder="Piper Chapman" value={staffFullName} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Date
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          disabled
                          placeholder="2021-Apr-30"
                          value={moment(this.state.date.date).format('ll')}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Time
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control disabled placeholder="14:30" value={this.state.time.time} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Contact Number:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          disabled
                          placeholder="647-596-9521"
                          value={this.state.appointment.contactNumber}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Special Request:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          disabled
                          as="textarea"
                          rows={3}
                          value={
                            this.state.appointment.specialRequest
                              ? this.state.appointment.specialRequest
                              : 'No special request'
                          }
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Message Box:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Message"
                          value={this.state.appointment.message}
                          onChange={this.onMessageChange.bind(this)}
                        />
                      </Col>
                    </Form.Group>
                    <Row>
                      <Col></Col>
                      <Col md="auto">
                        <Link to={`/Appointment/Admin/Appointment/${this.props.id}`}>
                          <Button variant="outline-secondary">Cancel</Button>
                        </Link>
                      </Col>
                      <Button type="submit" variant="outline-info">
                        Save
                      </Button>
                    </Row>
                  </Form>
                </Col>
                <Col></Col>
              </Row>
            </Container>
            <Container style={{ 'margin-top': '50px', cursor: 'pointer' }}></Container>
          </div>
        </div>
      </>
    );
  }
}

LeaveMessageToAppointment.propTypes = {
  id: PropTypes.string.isRequired,
};

export default LeaveMessageToAppointment;
