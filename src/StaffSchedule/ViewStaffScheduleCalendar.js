import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import StaffScheduleCalendar from './StaffScheduleCalendar';
import SavedPopUp from '../SavedPopUp';

class ViewStaffScheduleCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Staff/Schedules/Calendar', title: 'Schedule Calendar' },
        { url: '/Staff/Schedule/Create', title: 'Create Schedule' },
        { url: '/Staff/Schedules', title: 'View Schedule List' },
      ],
      weekCalendarView: 'week',
      dayCalendarView: 'day',
      savedBackLink: '/Staff/Schedule/Edit',
      title: 'Schedule Updated!',
      button: 'Back to schedule',
      saveModal: false,

      _id: localStorage.getItem('_id'),
      staff: [],
      account: [],
      workSchedules: [],
      schedules: [],
      today: new Date(),
    };
    this.showSave = this.showSave.bind(this);
    this.hideSave = this.hideSave.bind(this);
  }

  showSave = () => {
    this.setState({ saveModal: true });
  };

  hideSave = () => {
    this.setState({ saveModal: false });
  };

  getWorkSchedules(id) {
    fetch(`${process.env.REACT_APP_API_URL}/staffWorkSchedules?staff=${id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          workSchedules: data,
        });
        this.formatDateTimeForCalendar(this.state.workSchedules);
      });
  }

  componentDidMount() {
    document.title = 'Your Schedule Calendar | Body Contouring Clinic';
    fetch(`${process.env.REACT_APP_API_URL}/staff?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          staff: data,
          account: data.account,
        });
        this.getWorkSchedules(this.state.staff._id);
      });
  }

  formatDateTimeForCalendar = (schedules) => {
    if (!schedules) {
      console.log('error');
    } else {
      schedules.forEach((sch) => {
        let dateInts = sch.date.date.split('/');
        let timeInts = sch.time.time.split('-');
        let startTimeInts = timeInts[0].split(':');
        let endTimeInts = timeInts[1].split(':');

        let startTime = new Date(
          dateInts[2],
          dateInts[0] - 1,
          dateInts[1],
          startTimeInts[0],
          startTimeInts[1]
        );
        let endTime = new Date(
          dateInts[2],
          dateInts[0] - 1,
          dateInts[1],
          endTimeInts[0],
          endTimeInts[1]
        );

        let schedule = {
          id: sch._id,
          title: !sch.description ? ' ' : sch.description,
          category: 'time',
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          isReadOnly: true,
        };

        this.setState({
          schedules: this.state.schedules.concat(schedule),
        });
      });
    }
  };
  render() {
    return (
      <>
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-9">
            <Container style={{ marginLeft: '0px', marginRight: '0px', float: 'center' }}>
              <h2>
                Hi, {this.state.account.firstName + ' ' + this.state.account.lastName}, here is your
                schedule
              </h2>
              <hr />
              <br />
              <SavedPopUp
                show={this.state.saveModal}
                handelClose={this.hideSave}
                text={this.state.title}
                href={this.state.savedBackLink}
                button={this.state.button}
              />
              <Row>
                <Col>
                  <StaffScheduleCalendar
                    view={this.state.weekCalendarView}
                    schedule={this.state.schedules}
                    today={this.state.today}
                  />
                </Col>
              </Row>
            </Container>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </>
    );
  }
}

export default ViewStaffScheduleCalendar;
