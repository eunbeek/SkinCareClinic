import React from 'react';
import '../App.css';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

class EditAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment', title: 'Appointment Home' },
        { url: '/Appointment/Appointments', title: 'View All Appointments' },
        { url: '/Appointment/Create', title: 'Create Appointment' },
      ],
      saveModal: false,
      title: 'Appointment saved!',
      savedBackLink: '/Appointment/Appointment',
      button: 'Back To Appointment',
      appointment: [],
      customer: [],
      schedule: [],
      time: [],
      date: [],
      service: [],
      staff: [],
      completed: false,
      allServices: [],
      allTechnicians: [],
      filterData: [],
      technician: [],
      printDate: String,
      editAppmnt: {
        schedule: '',
      },
      technicianNull: false,
      contactNumberNull: false,
      timeNull: true,
      selectedDay: null,
      availableDays: [],
      confirmDay: null,
      year: '',
      month: '',
      day: '',
    };
    this.showSave = this.showSave.bind(this);
    this.hideSave = this.hideSave.bind(this);
    this.getAvailableDays = this.getAvailableDays.bind(this);
  }

  showSave = () => {
    this.setState({ saveModal: true });
  };

  hideSave = () => {
    this.setState({ saveModal: false });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      contactNumberNull: false,
      technicianNull: false,
    });
    if (this.state.appointment.contactNumber == '' || this.state.editAppmnt.schedule == '') {
      this.state.appointment.contactNumber == ''
        ? this.setState({ contactNumberNull: true })
        : this.setState({ contactNumberNull: false });
      this.state.editAppmnt.schedule == ''
        ? this.setState({ technicianNull: true })
        : this.setState({ technicianNull: false });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`, {
        method: 'PUT',
        body: JSON.stringify(this.state.editAppmnt),
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

  onContactNumChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        contactNumber: event.target.value,
      },
      editAppmnt: {
        ...this.state.editAppmnt,
        contactNumber: event.target.value,
      },
    }));
  }

  onSpecialRequestChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        specialRequest: event.target.value,
      },
      editAppmnt: {
        ...this.state.editAppmnt,
        specialRequest: event.target.value,
      },
    }));
  }

  onServiceChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        service: event.target.value,
      },
      editAppmnt: {
        ...this.state.editAppmnt,
        service: event.target.value,
      },
    }));
  }

  onDateChange(day, { selected }) {
    this.setState({
      printDate: day,
      selectedDay: selected ? undefined : day,
      confirmDay: day,
    });
    fetch(`${process.env.REACT_APP_API_URL}/workSchedule?date=${moment(day).format('MM/DD/YYYY')}`)
      .then((response) => response.json())
      .then((data) => {
        var allDays = [];
        data.map((schedule) => {
          if (schedule.booked == false) {
            allDays = allDays.concat(schedule);
          }
        });
        this.setState({
          filterData: allDays,
          timeNull: true,
        });
      });
  }

  onTimeChange(event) {
    var technicianData = [];
    this.state.filterData.forEach(function (data) {
      if (data.time._id == event.target.value) {
        technicianData = technicianData.concat(data);
      }
    });
    this.setState({
      technician: technicianData,
      timeNull: false,
    });
  }

  onScheduleChange(event) {
    this.setState({
      appointment: {
        ...this.state.appointment,
        schedule: event.target.value,
      },
      editAppmnt: {
        ...this.state.editAppmnt,
        schedule: event.target.value,
      },
    });
  }

  getAvailableDays() {
    fetch(`${process.env.REACT_APP_API_URL}/workSchedules`)
      .then((response) => response.json())
      .then((data) => {
        var allDays = [];
        data.map((schedule) => {
          if (schedule.booked == false && moment(schedule.date.date).isAfter(new Date())) {
            allDays = allDays.concat(moment(schedule.date.date, 'MM/DD/YYYY').toDate());
          }
        });

        this.setState({
          availableDays: allDays,
        });
      });
  }

  componentDidMount() {
    document.title = 'Edit Appointment | Body Contouring Clinic';
    fetch(`${process.env.REACT_APP_API_URL}/appointment/${this.props.id}`)
      .then((response) => response.json())
      .then((data) => {
        var pDate = data.schedule.date.date.split('/');
        var result = pDate[2] + '-' + pDate[0] + '-' + pDate[1];

        this.setState({
          appointment: data,
          customer: data.customer.account,
          schedule: data.schedule,
          time: data.schedule.time,
          date: data.schedule.date,
          staff: data.schedule.staff,
          service: data.service,
          printDate: result,
          year: data.schedule.date.date.split('/')[2],
          month: data.schedule.date.date.split('/')[0],
          day: data.schedule.date.date.split('/')[1],
        });

        fetch(`${process.env.REACT_APP_API_URL}/services`)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              allServices: data,
            });
          });

        fetch(`${process.env.REACT_APP_API_URL}/staffs`)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              allTechnicians: data,
            });
          });
      });
    this.getAvailableDays();
  }

  render() {
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: `/Appointment/Appointment/${this.props.id}`,
          }}
        />
      );
    }
    if (
      moment(this.state.year + '-' + this.state.month + '-' + this.state.day).isBefore(new Date())
    ) {
      return (
        <Redirect
          push
          to={{
            pathname: `/Appointment/Appointment/${this.props.id}`,
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
            <h2>Edit Appointment</h2>
            <br />
            <Container>
              <Row>
                <Col></Col>
                <Col xs={8}>
                  <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Service(s):
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control inline as="select" onChange={this.onServiceChange.bind(this)}>
                          <option>{this.state.service.name}</option>
                          {this.state.allServices.map((result) =>
                            result.name != this.state.service.name ? (
                              // eslint-disable-next-line react/jsx-key
                              <option key={result._id} value={result._id}>
                                {result.name}
                              </option>
                            ) : (
                              ''
                            )
                          )}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Date
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="input"
                          value={
                            this.state.confirmDay != null
                              ? this.state.confirmDay.toLocaleDateString()
                              : 'Please select a day'
                          }
                        />
                        <DayPicker
                          showOutsideDays
                          selectedDays={this.state.availableDays}
                          disabledDays={[{ before: new Date() }]}
                          onDayClick={this.onDateChange.bind(this)}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Time
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          inline
                          as="select"
                          onChange={this.onTimeChange.bind(this)}
                          isInvalid={this.state.timeNull}
                        >
                          <option value="">-- select time --</option>
                          {this.state.filterData.map((result) => (
                            // eslint-disable-next-line react/jsx-key
                            <option value={result.time._id}>{result.time.time}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Time is required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Technician:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="select"
                          onChange={this.onScheduleChange.bind(this)}
                          isInvalid={this.state.technicianNull}
                        >
                          <option value="">-- select technician --</option>
                          {this.state.technician.map((result) => (
                            // eslint-disable-next-line react/jsx-key
                            <option value={result._id}>
                              {result.staff.account.firstName} {result.staff.account.lastName}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Technician is required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Contact Number:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          placeholder="647-596-9521"
                          value={this.state.appointment.contactNumber}
                          onChange={this.onContactNumChange.bind(this)}
                          isInvalid={this.state.contactNumberNull}
                        />
                        <Form.Control.Feedback type="invalid">
                          Contact Number is required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="exampleForm.ControlTextarea1">
                      <Form.Label column sm="4">
                        Special Request:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Vanilla essential oil"
                          value={this.state.appointment.specialRequest}
                          onChange={this.onSpecialRequestChange.bind(this)}
                        />
                      </Col>
                    </Form.Group>
                    <Row>
                      <Col></Col>
                      <Col md="auto">
                        <Button variant="outline-secondary" href="/Appointment/Appointments">
                          Cancel
                        </Button>
                      </Col>
                      <Button action type="submit" variant="outline-info">
                        Save
                      </Button>
                    </Row>
                  </Form>
                </Col>
                <Col></Col>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  }
}

EditAppointment.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditAppointment;
