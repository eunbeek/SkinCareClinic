import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';

class AppointmentDeletedAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment/Admin', title: 'View All Appointments' },
        { url: '/Appointment/Admin/Create', title: 'Create Appointment' },
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
                  <Button variant="outline-info" href="/Appointment/Admin">
                    Back to Appointment List
                  </Button>
                </Col>
                <Col>
                  <Button variant="outline-info" href="/Appointment/Admin/Create">
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

export default AppointmentDeletedAdmin;
