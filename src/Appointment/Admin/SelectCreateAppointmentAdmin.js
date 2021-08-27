import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import CreateAppointment from './CreateAppointmentAdmin';
import CreateAppointmentByStaff from './CreateAppointmentAdminbyStaff';

class SelectCreateAppointmentAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment/Admin', title: 'View All Appointments' },
        { url: '/Appointment/Admin/Create', title: 'Create Appointment' },
      ],
      _id: localStorage.getItem('_id'),
      customer: [],
      account: [],
    };
  }

  componentDidMount() {
    document.title = 'All Appointments | Body Contouring Clinic';

    fetch(`${process.env.REACT_APP_API_URL}/staff?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
          account: data.account,
        });
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">
            Hello, {this.state.account.firstName} {this.state.account.lastName},
          </h2>
          <br />
          <br />
          <div className="contents">
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="outline-*" eventKey="0">
                    Book an appointment by Date
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <CreateAppointment />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="outline-*" eventKey="1">
                    Book an appointment by Technician
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <CreateAppointmentByStaff />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectCreateAppointmentAdmin;
