import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import '../App.css';
import AppointmentCalendar from './AppointmentCalendar';
import { Link } from 'react-router-dom';

class AppointmentHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarView: 'month',
      _id: localStorage.getItem('_id'),
      customer: [],
      account: [],
    };
  }

  componentDidMount() {
    document.title = 'Appointment Home | Body Contouring Clinic';

    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
          account: data.account,
        });
      });
  }

  render() {
    const calendar = {
      width: '1200px',
      height: '1000px',
    };
    return (
      <div className="App-basic">
        <h2>
          Hello, {this.state.account.firstName} {this.state.account.lastName}
        </h2>
        <br />
        <Card className="p-3">
          <blockquote className="blockquote mb-0 card-body" style={calendar}>
            <p>
              <AppointmentCalendar view={this.state.calendarView} />
            </p>
          </blockquote>
        </Card>
        <br />
        <br />
        <Container>
          <Row>
            <Col>
              <Button variant="outline-info" href="/Appointment/Appointments">
                View All Appointments
              </Button>
            </Col>
            <Col>
              <Link to={`/Appointment/Create`}>
                <Button variant="outline-secondary">Create Appointment</Button>
              </Link>
            </Col>
          </Row>
          <br />
          <br />
        </Container>
      </div>
    );
  }
}

export default AppointmentHome;
