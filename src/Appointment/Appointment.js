import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import '../App.css';
import styles from '../app.module.css';
import SideBar from '../SideBar/SideBar';
import PopUp from '../PopUp';
import ViewAppointmentMessage from './ViewAppointmentMessage';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment', title: 'Appointment Home' },
        { url: '/Appointment/Appointments', title: 'View All Appointments' },
        { url: '/Appointment/Create', title: 'Create Appointment' },
      ],
      show: false,
      children: 'appointment',
      msgModal: false,
      deletedLink: '/Appointment/Deleted',
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
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
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

  showMessage = () => {
    this.setState({ msgModal: true });
  };

  closeMessage = () => {
    this.setState({ msgModal: false });
  };

  componentDidMount() {
    document.title = 'Create New Appointment | Body Contouring Clinic';
    fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appointment: data,
          customer: data.customer.account,
          schedule: data.schedule,
          time: data.schedule.time,
          date: data.schedule.date,
          year: data.schedule.date.date.split('/')[2],
          month: data.schedule.date.date.split('/')[0],
          day: data.schedule.date.date.split('/')[1],
          staff: data.schedule.staff == null ? null : data.schedule.staff.account,
          service: data.service,
        });
      });
  }
  render() {
    return (
      <>
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-6">
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
              <Row>
                <Col></Col>
                <Col xs={7}>
                  <table className={styles.appointmentTable}>
                    <tr>
                      <td>Customer Name: </td>
                      <td>
                        {this.state.customer.firstName} {this.state.customer.lastName}
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
                      <td>Technician:</td>
                      <td>
                        {this.state.staff == null ? '' : this.state.staff.firstName}{' '}
                        {this.state.staff == null ? '' : this.state.staff.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td>Service:</td>
                      <td>{this.state.service.name}</td>
                    </tr>
                    <tr>
                      <td>price:</td>
                      <td>
                        ${' '}
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
                      <td>{this.state.appointment.specialRequest}</td>
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
                    onClick={this.showMessage}
                    variant="outline-info"
                    style={{ 'margin-right': '5px' }}
                  >
                    View Message
                  </Button>{' '}
                  <ViewAppointmentMessage
                    show={this.state.msgModal}
                    handleClose={this.closeMessage}
                    text={this.state.appointment.message}
                    appointmentId={this.state.appointment._id}
                  />
                  <Button variant="outline-danger" onClick={this.showModal}>
                    Delete
                  </Button>{' '}
                  {moment(this.state.year + '-' + this.state.month + '-' + this.state.day).isBefore(
                    new Date()
                  ) ? (
                    ''
                  ) : (
                    <Link to={`/Appointment/Edit/${this.state.appointment._id}`}>
                      <Button style={{ 'margin-left': '5px' }} variant="outline-secondary">
                        Edit
                      </Button>
                    </Link>
                  )}
                </Col>
                <PopUp
                  show={this.state.show}
                  handleClose={this.hideModal}
                  handleDelete={this.handleDelete}
                  text={this.state.children}
                  link={this.state.deletedLink}
                  btn1="Cancel"
                  btn2="Delete"
                />
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }
}

Appointment.propTypes = {
  id: PropTypes.string.isRequired,
};
export default Appointment;
