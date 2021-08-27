import React from 'react';
import { Container, Row, Col, Button, Dropdown, Form, Modal, Badge } from 'react-bootstrap';
import '../../App.css';
import styles from '../../app.module.css';
import SideBar from '../../SideBar/SideBar';
import PopUp from '../../PopUp';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';

class AppointmentAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment/Admin/', title: 'View All Appointments' },
        { url: '/Appointment/Admin/Create', title: 'New Appointment' },
      ],
      show: false,
      children: 'appointment',
      deletedLink: '/Appointment/Admin/Deleted',
      appointment: [],
      customer: [],
      schedule: [],
      time: [],
      date: [],
      year: '',
      month: '',
      day: '',
      service: [],
      staff: [],
      completed: false,
      alert: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.showAlert = this.showAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  showAlert = () => {
    this.setState({ alert: true });
  };

  hideAlert = () => {
    this.setState({ alert: false });
  };

  deleteAppointment = () => {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  };

  handleDelete = () => {
    this.deleteAppointment()
      .then((response) => response.json())
      .then(() =>
        this.setState({
          show: false,
        })
      )
      .catch((err) => console.log(err));
  };

  onConfirmChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        confirmation: event,
      },
    }));
  }

  updateConfirmation(event) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/appointment/confirm/${this.props.id}`, {
      method: 'PUT',
      body: JSON.stringify(this.state.appointment),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        this.setState({ alert: true });
      })
      .then(() => {
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
      });
  }

  getAppointment() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  componentDidMount() {
    this.getAppointment().then((data) => {
      this.setState({
        appointment: data,
        customer: data.customer.account,
        schedule: data.schedule,
        time: data.schedule.time,
        date: data.schedule.date,
        year: data.schedule.date.date.split('/')[2],
        month: data.schedule.date.date.split('/')[0],
        day: data.schedule.date.date.split('/')[1],
        staff: data.schedule.staff.account,
        service: data.service,
      });
    });
  }

  render() {
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Appointment/Admin',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-6" style={{ 'margin-left': '80px' }}>
          <h2>
            Appointment Details{' '}
            {this.state.appointment.isOffer ? (
              <Badge pill variant="info">
                Promotion
              </Badge>
            ) : (
              ''
            )}
          </h2>
          <br />
          <Container>
            <Form onSubmit={this.updateConfirmation.bind(this)}>
              <Row>
                <Col>
                  <table className={styles.appointmentTable}>
                    <tr>
                      <td>Customer Name: </td>
                      <td>
                        {this.state.customer == null ? '' : this.state.customer.firstName}{' '}
                        {this.state.customer == null ? '' : this.state.customer.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td>Date:</td>
                      <td>
                        {moment(this.state.year + this.state.month + this.state.day).format('ll')}
                      </td>
                    </tr>
                    <tr>
                      <td>Time:</td>
                      <td>{this.state.time == null ? '' : this.state.time.time}</td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            {this.state.appointment.confirmation == 'false' ? 'Await' : 'Confirmed'}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              eventKey="false"
                              variant="outline-secondary"
                              onSelect={this.onConfirmChange.bind(this)}
                            >
                              Await
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="true"
                              variant="outline-success"
                              onSelect={this.onConfirmChange.bind(this)}
                            >
                              Confirmed
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr>
                      <td>Technician:</td>
                      <td>
                        {this.state.staff.firstName} {this.state.staff.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td>Service:</td>
                      <td>{this.state.service.name}</td>
                    </tr>
                    <tr>
                      <td>Price:</td>
                      <td>
                        $
                        {this.state.appointment.isOffer == true
                          ? this.state.appointment.offerPrice
                          : this.state.service.price}
                      </td>
                    </tr>
                    <tr>
                      <td>Contact #:</td>
                      <td>{this.state.appointment.contactNumber}</td>
                    </tr>
                    <tr>
                      <td>Special Request:</td>
                      <td>
                        {this.state.appointment.specialRequest
                          ? this.state.appointment.specialRequest
                          : 'No special request'}
                      </td>
                    </tr>
                    <tr>
                      <td>Message:</td>
                      <td>
                        {this.state.appointment.message
                          ? this.state.appointment.message
                          : 'No message'}
                      </td>
                    </tr>
                  </table>
                </Col>
                <Col></Col>
              </Row>
              <br />
              <Row>
                <Col></Col>
                <Col md="auto">
                  <Button
                    variant="outline-success"
                    action
                    type="submit"
                    style={{ 'margin-right': '5px' }}
                  >
                    Confirm Status
                  </Button>
                  <Link to={`/Appointment/Admin/Message/${this.props.id}`}>
                    <Button variant="outline-secondary">Leave Message</Button>
                  </Link>{' '}
                  <Button
                    style={{ 'margin-left': '5px' }}
                    variant="outline-danger"
                    onClick={this.showModal}
                  >
                    Delete
                  </Button>{' '}
                  {moment(this.state.year + '-' + this.state.month + '-' + this.state.day).isBefore(
                    new Date()
                  ) ? (
                    ''
                  ) : (
                    <Link to={`/Appointment/Admin/Edit/${this.props.id}`}>
                      <Button variant="outline-secondary">Edit</Button>
                    </Link>
                  )}
                </Col>
                <PopUp
                  show={this.state.show}
                  link={this.state.deletedLink}
                  handleClose={this.hideModal}
                  handleDelete={this.handleDelete}
                  text={this.state.children}
                  btn1="Cancel"
                  btn2="Delete"
                />
                <Modal show={this.state.alert} centered>
                  <Modal.Header closeButton onClick={this.hideAlert}>
                    <Modal.Title>Appointment Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      {this.state.appointment.confirmation == 'true'
                        ? 'This Appointment is confirmed'
                        : 'This appointment is still waiting for customer'}
                    </p>
                  </Modal.Body>
                </Modal>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    );
  }
}

AppointmentAdmin.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AppointmentAdmin;
