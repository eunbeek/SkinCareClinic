import React from 'react';
import '../App.css';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

class CreateAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveModal: false,
      savedBackLink: '/Appointment/Appointment',
      button: 'Back To Appointment',
      title: 'Appointment Saved!',

      completed: false,
      _id: localStorage.getItem('_id'),
      appointment: {
        customer: String,
        contactNumber: '',
        specialRequest: String,
        service: '',
        schedule: '',
        confirmation: 'false',
      },
      services: [],
      customer: {},
      filterData: [],
      technician: [],
      tempTime: '',
      serviceNull: false,
      timeNull: false,
      dateNull: false,
      technicianNull: false,
      contactNumNull: false,
      selectedDay: null,
      availableDays: [],
      confirmDay: null,
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

    this.state.appointment.service == ''
      ? this.setState({ serviceNull: true })
      : this.setState({ serviceNull: false });
    this.state.appointment.schedule == ''
      ? this.setState({ technicianNull: true })
      : this.setState({ technicianNull: false });
    this.state.filterData == ''
      ? this.setState({ dateNull: true })
      : this.setState({ dateNull: false });
    this.state.tempTime == ''
      ? this.setState({ timeNull: true })
      : this.setState({ timeNull: false });
    this.state.appointment.contactNumber == ''
      ? this.setState({ contactNumNull: true })
      : this.setState({ contactNumNull: false });

    fetch(`${process.env.REACT_APP_API_URL}/create-appointment`, {
      method: 'POST',
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

  onServiceChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        customer: this.state.customer._id,
        service: event.target.value,
      },
      serviceNull: false,
    }));
  }

  onContactNumChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        contactNumber: event.target.value,
      },
      contactNumNull: false,
    }));
  }

  onSpecialRequestChange(event) {
    this.setState(() => ({
      appointment: {
        ...this.state.appointment,
        specialRequest: event.target.value,
      },
    }));
  }

  onDateChange(day, { selected }) {
    this.setState({
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
          dateNull: false,
          timeNull: true,
        });
      });
  }

  onTimeChange(event) {
    var technicianData = [];
    this.state.filterData.map((data) => {
      if (data.time._id == event.target.value) {
        technicianData = technicianData.concat(data);
      }
    });
    this.setState({
      technician: technicianData,
      timeNull: false,
      tempTime: event.target.value,
    });
  }

  onScheduleChange(event) {
    this.setState({
      appointment: {
        ...this.state.appointment,
        schedule: event.target.value,
      },
      technicianNull: false,
    });
  }

  getService() {
    fetch(`${process.env.REACT_APP_API_URL}/services`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          services: data,
        });
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
    document.title = 'Create New Appointment | Body Contouring Clinic';

    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
        });
        this.getService();
        this.getAvailableDays();
      });
  }

  render() {
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: `/Appointment/Appointments`,
          }}
        />
      );
    }
    return (
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
                  <Form.Control.Feedback type="invalid">Time is required</Form.Control.Feedback>
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
                    isInvalid={this.state.contactNumNull}
                  />
                  <Form.Control.Feedback type="invalid">
                    Contact Number is required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
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
                  <Button variant="outline-secondary" href="/Appointment/">
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
    );
  }
}

export default CreateAppointment;
