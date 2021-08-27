import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import PopUp from '../PopUp';
import { Redirect } from 'react-router';
import moment from 'moment';

class ViewScheduleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Staff/Schedules/Calendar', title: 'Schedule Calendar' },
        { url: '/Staff/Schedule/Create', title: 'Create Schedule' },
        { url: '/Staff/Schedules', title: 'View Schedule List' },
      ],
      workSchedule: [],
      workScheduleId: '',
      popUpText: 'schedule',
      date: [],
      time: [],
      show: false,
      beforeToday: false,
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
    this.deleteWorkSchedule().then(() => {
      this.getWorkSchedule(this.state.workScheduleId).then((data) => {
        this.setState({
          workSchedule: data,
        });
      });
    });
    this.setState({
      show: false,
      workSchedule: null,
      completed: true,
    });
  };

  getWorkSchedule(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/workSchedule/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  deleteWorkSchedule() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/workSchedule/${this.state.workScheduleId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  componentDidMount() {
    this.getWorkSchedule(this.props.id).then((data) => {
      this.setState({
        workSchedule: data,
        workScheduleId: data._id,
        date: data.date,
        time: data.time,
      });
      if (moment(data.date.date).isBefore()) {
        this.setState({
          beforeToday: true,
        });
      }
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
          <h2 className="PageTitle">Schedule Details</h2>
          <br />
          <Container>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Date:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    readOnly
                    value={moment(this.state.date.date).format('ll')}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Time:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control type="text" readOnly value={this.state.time.time}></Form.Control>
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
                    readOnly
                    value={
                      !this.state.workSchedule.description
                        ? 'No Description'
                        : this.state.workSchedule.description
                    }
                  />
                </Col>
              </Form.Group>
              <br />
              <Container>
                <Row>
                  <Col xs={6}></Col>
                  <Col md="auto">
                    {!this.state.beforeToday && (
                      <Button
                        variant="outline-info"
                        style={{ 'margin-right': '5px' }}
                        href={`/Staff/Schedule/Edit/${this.state.workScheduleId}`}
                      >
                        Edit
                      </Button>
                    )}
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
                      text={this.state.popUpText}
                      btn1="Cancel"
                      btn2="Delete"
                    />
                    <Button
                      variant="outline-secondary"
                      style={{ 'margin-left': '5px' }}
                      href="/Staff/Schedules"
                    >
                      Back to List
                    </Button>
                  </Col>
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

export default ViewScheduleDetail;
