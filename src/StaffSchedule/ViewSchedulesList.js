import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import searchIcon from '../resources/searchIcon.png';
import moment from 'moment';

class ViewSchedulesList extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [
        { url: '/Staff/Schedules/Calendar', title: 'Schedule Calendar' },
        { url: '/Staff/Schedule/Create', title: 'Create Schedule' },
        { url: '/Staff/Schedules', title: 'View Schedule List' },
      ],
      loaded: true,
      _id: localStorage.getItem('_id'),
      staff: [],
      account: [],
      workSchedules: [],
      date: [],
      time: [],
      filter: '',
      filteredSchedules: [],
      status: '',
    };
  }

  getWorkSchedules(id) {
    document.title = 'Your Schedule List | Body Contouring Clinic';
    fetch(`${process.env.REACT_APP_API_URL}/staffWorkSchedules?staff=${id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          workSchedules: data,
          filteredSchedules: data,
        });
      });
  }

  handleFilterChange(e) {
    this.setState({ filter: e.target.value });
  }

  handleStatusChange(e) {
    this.setState({ status: e.target.value });
  }

  filterSchedules() {
    if (this.state.filter.length > 0) {
      if (this.state.filter == 'today') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(new Date(), 'day');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'tomorrow') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(moment().add(1, 'day'), 'day');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'week') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(new Date(), 'isoWeek');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'nextWeek') {
        const dayInNextWeek = moment().startOf('isoWeek').add(7, 'day');
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(dayInNextWeek, 'isoWeek');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'month') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(new Date(), 'month');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'nextMonth') {
        const dayInNextMonth = moment().add(1, 'month');
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return moment(sch.date.date).isSame(dayInNextMonth, 'month');
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.filter == 'all') {
        this.setState({ filteredSchedules: this.state.workSchedules });
      }
    } else if (this.state.status.length > 0) {
      if (this.state.status == 'available') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return sch.booked !== true;
        });
        this.setState({ filteredSchedules: newSchedules });
      } else if (this.state.status == 'booked') {
        const newSchedules = this.state.workSchedules.filter((sch) => {
          return sch.booked === true;
        });
        this.setState({ filteredSchedules: newSchedules });
      }
    }
  }

  resetAll() {
    this.setState({
      filteredSchedules: this.state.workSchedules,
      filter: '',
      status: '',
    });
  }

  componentDidMount() {
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

  sortingByDate(a, b) {
    let dateA = new Date(a.date.date).getTime();
    let dateB = new Date(b.date.date).getTime();
    return dateA < dateB ? -1 : 1;
  }

  render() {
    this.state.filteredSchedules.sort(this.sortingByDate);
    if (this.state.loaded) {
      return (
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-8" style={{ 'margin-left': '80px' }}>
            <h2 className="PageTitle">
              Hi, {this.state.account.firstName + ' ' + this.state.account.lastName}, these are your
              schedules
            </h2>
            <br />
            <div className="contents">
              <Form inline>
                <Form.Control
                  as="select"
                  name="days"
                  value={this.state.filter}
                  onChange={this.handleFilterChange.bind(this)}
                >
                  <option value="all">N/A</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="nextWeek">Next Week</option>
                  <option value="month">This Month</option>
                  <option value="nextMonth">Next Month</option>
                </Form.Control>
                <Form.Control
                  as="select"
                  style={{ 'margin-left': '24px' }}
                  onChange={this.handleStatusChange.bind(this)}
                >
                  <option value="" default>
                    All
                  </option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </Form.Control>
                <Button
                  variant="outline-*"
                  onClick={this.filterSchedules.bind(this)}
                  style={{ background: 'none', 'margin-left': '5px' }}
                >
                  <img src={searchIcon} alt="Search" />
                </Button>
                <Button variant="link" onClick={this.resetAll.bind(this)}>
                  Reset
                </Button>
              </Form>
              <br />
              <table>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>

                {this.state.filteredSchedules.map((sch) => (
                  <tr key={sch._id}>
                    <td>{moment(sch.date.date).format('ll')}</td>
                    <td>{sch.time.time}</td>
                    <td>{sch.booked ? 'Booked' : 'Available'}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        href={`/Staff/Schedule/Detail/${sch._id}`}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </table>
              <br /> <br />
              <Container>
                <Row>
                  <Col xs={10}></Col>
                  <Col xs={1}></Col>
                  <Col xs={1}>
                    <Button variant="outline-info" href="/Staff/Schedule/Create">
                      Create
                    </Button>
                  </Col>
                </Row>
              </Container>
              <br />
              <br />
            </div>
            <br />
            <br />
          </div>
        </div>
      );
    }
  }
}

export default ViewSchedulesList;
