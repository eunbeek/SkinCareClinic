import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

class CreateSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Staff/Schedules/Calendar', title: 'Schedule Calendar' },
        { url: '/Staff/Schedule/Create', title: 'Create Schedule' },
        { url: '/Staff/Schedules', title: 'View Schedule List' },
      ],
      _id: localStorage.getItem('_id'),
      workSchedule: {
        staff: {},
        date: String,
        time: String,
        description: String,
      },
      staff: '',
      dates: [],
      times: [],
      completed: false,
      dateIsSelected: true,
      timeIsSelected: true,
      errors: [],
      form: [],
      date: '',
      time: '',
      selectedDays: [],
      dayIds: [],
      description: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  findErrors() {
    const errList = {};
    if (!this.state.date || this.state.date === '') {
      errList.date = 'Date is required';
      this.setState(() => ({ dateIsSelected: false }));
    }
    if (!this.state.time || this.state.time === '') {
      errList.time = 'Time is required';
      this.setState(() => ({ timeIsSelected: false }));
    }
    return errList;
  }

  handleSubmit(e) {
    e.preventDefault();
    const errList = this.findErrors();
    if (Object.keys(errList).length > 0) {
      this.setState(() => ({
        errors: errList,
      }));
    }

    this.state.dayIds.map((day) => {
      var tempSchedule = {
        staff: this.state.staff._id,
        date: day,
        time: this.state.time,
        description: this.state.description,
      };

      this.createWorkSchedule(tempSchedule)
        .then(() => {})
        .catch((err) => console.log(err));
    });

    this.setState({ completed: true });
  }

  createWorkSchedule(schedule) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/create-workSchedule`, {
        method: 'POST',
        body: JSON.stringify(schedule),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((data) => {
        resolve(data);
      });
    });
  }

  onDateChange(day, { selected }) {
    const selectedDays = this.state.selectedDays.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });

    this.getEachDateId(day).then((data) => {
      this.setState({
        dayIds: this.state.dayIds.concat(data._id),
      });
    });
  }

  getEachDateId(day) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/date?date=${moment(day).format('MM/DD/YYYY')}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data[0]);
        });
    });
  }

  onTimeChange(e) {
    if (e.target.value.length < 6) {
      this.setState(() => ({
        workSchedule: {
          ...this.state.workSchedule,
          staff: this.state.staff._id,
          time: e.target.value,
        },
        timeIsSelected: false,
        time: e.target.value,
      }));
    } else {
      this.setState(() => ({
        workSchedule: {
          ...this.state.workSchedule,
          staff: this.state.staff._id,
          time: e.target.value,
        },
        timeIsSelected: true,
        time: e.target.value,
      }));
    }
  }

  onDescriptionChange(e) {
    this.setState(() => ({
      workSchedule: {
        ...this.state.workSchedule,
        description: e.target.value,
      },
      description: e.target.value,
    }));
  }

  getDates() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/dates`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  getTimes() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/times`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }
  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/staff?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          staff: data,
        });
      });
    this.getDates().then((data) => {
      this.setState({
        dates: data.filter((d) => {
          return moment(d.date).isAfter();
        }),
      });
    });
    this.getTimes().then((data) => {
      this.setState({
        times: data,
      });
    });
  }
  render() {
    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: '/Staff/Schedules',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Create New Schedule</h2>
          <br />
          <Container>
            <Form noValidate onSubmit={this.handleSubmit.bind(this)} method="POST">
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Date:
                </Form.Label>
                <Col sm="2">
                  <DayPicker
                    showOutsideDays
                    selectedDays={this.state.selectedDays}
                    disabledDays={[{ before: new Date() }]}
                    onDayClick={this.onDateChange.bind(this)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.date}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Time:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="select"
                    onChange={this.onTimeChange.bind(this)}
                    isInvalid={!this.state.timeIsSelected}
                  >
                    <option value="">--Choose--</option>
                    {this.state.times.map((time) => (
                      <option key={time._id} value={time._id}>
                        {time.time}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.time}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Description:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={this.onDescriptionChange.bind(this)}
                  />
                </Col>
              </Form.Group>
              <br />
              <Container>
                <Row>
                  <Col xs={6}></Col>
                  <Col md="auto">
                    <Button variant="outline-secondary" href="/Staff/Schedules">
                      Cancel
                    </Button>
                  </Col>
                  <Button variant="outline-info" type="submit">
                    Save
                  </Button>
                </Row>
              </Container>
            </Form>
            <br />
            <br />
          </Container>
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default CreateSchedule;
