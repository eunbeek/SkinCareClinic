import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../App.css';
import SideBar from '../SideBar/SideBar';

class AppointmentDeleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment', title: 'Appointment Home' },
        { url: '/Appointment/Appointments', title: 'View All Appointments' },
        { url: '/Appointment/Create', title: 'Create Appointment' },
      ],
    };
  }

  componentDidMount() {
    document.title = 'Appointment Deleted | Body Contouring Clinic';
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-6">
            <h1 style={{ margin: '100px' }}>Appointment Deleted!</h1>
            <Container>
              <Row>
                <Col>
                  <Button variant="outline-info" href="/Appointment/Appointments">
                    Back to Appointment List
                  </Button>
                </Col>
                <Col>
                  <Button variant="outline-info" href="/Appointment/Create">
                    Create Appointment
                  </Button>
                </Col>
              </Row>
              <br />
              <br />
            </Container>
          </div>
        </div>
      </>
    );
  }
}

export default AppointmentDeleted;
