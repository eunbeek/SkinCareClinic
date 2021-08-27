import React from 'react';
import { Form, Button, Pagination } from 'react-bootstrap';
import searchIcon from '../../resources/searchIcon.png';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import { Link } from 'react-router-dom';
import moment from 'moment';

class AppointmentsAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment/Admin', title: 'View All Appointments' },
        { url: '/Appointment/Admin/Create', title: 'Create Appointment' },
      ],
      appointments: [],
      filterAppointments: [],
      dayValue: 0,
      searchType: [],
      searchDate: '',
      filter: '',
      currentPage: 1,
      perPage: 8,
    };
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  prevPage() {
    if (this.state.currentPage > 1) {
      this.setState({
        currentPage: parseInt(this.state.currentPage) - 1,
      });
    }
  }
  nextPage() {
    if (
      this.state.currentPage < Math.ceil(this.state.filterAppointments.length / this.state.perPage)
    ) {
      this.setState({
        currentPage: parseInt(this.state.currentPage) + 1,
      });
    }
  }
  handlePage(e) {
    this.setState({
      currentPage: Number(e.target.id),
    });
  }

  handleDayChange(e) {
    this.setState({
      dayValue: e.target.value,
    });
  }

  handleSearchTypeChange(e) {
    this.setState({
      searchType: e.target.value,
    });
  }

  handleSearchDateChange(e) {
    this.setState({
      searchDate: e.target.value,
    });
  }

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  updateAppointment() {
    if (this.state.searchDate) {
      const newAppointments = this.state.appointments.filter((req) => {
        return moment(req.schedule.date.date).isSame(this.state.searchDate);
      });
      this.setState({ filterAppointments: newAppointments });
    } else if (this.state.dayValue) {
      this.setState({
        searchDate: '',
      });
      const newAppointments = this.state.appointments.filter((req) => {
        if (this.state.dayValue == '9999') {
          return moment(req.schedule.date.date);
        } else {
          return moment(req.schedule.date.date).isBetween(
            moment(),
            moment().add(parseInt(this.state.dayValue), 'days')
          );
        }
      });
      this.setState({ filterAppointments: newAppointments });
    } else if (this.state.searchType) {
      if (this.state.searchType == 'customer') {
        const newAppointments = this.state.appointments.filter((req) => {
          let name = req.customer.account.firstName + req.customer.account.lastName;
          return name.toLowerCase().includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterAppointments: newAppointments });
      } else if (this.state.searchType == 'service') {
        const newAppointments = this.state.appointments.filter((req) => {
          return req.service.name.toLowerCase().includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterAppointments: newAppointments });
      }
    }
  }

  resetAll() {
    this.getAppointments().then((data) => {
      this.setState({
        filter: '',
        appointments: data,
        filterAppointments: data,
        searchDate: '',
        dayValue: 9999,
        searchType: data,
      });
    });
  }

  getAppointments() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/appointments`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  componentDidMount() {
    document.title = 'All Appointments | Body Contouring Clinic';
    this.getAppointments().then((data) => {
      this.setState({
        appointments: data,
        filterAppointments: data,
      });
    });
  }

  render() {
    const indexOfLast = this.state.currentPage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currentItems = this.state.filterAppointments.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.filterAppointments.length / this.state.perPage);
      i++
    ) {
      pageNums.push(
        <Pagination.Item key={i} id={i} onClick={this.handlePage.bind(this)}>
          {i}
        </Pagination.Item>
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Appointments</h2>
          <div className="contents">
            <Form inline>
              <Form.Control
                as="select"
                name="days"
                value={this.state.dayValue}
                onChange={this.handleDayChange}
              >
                <option value="9999">All</option>
                <option value="7">within 7 days</option>
                <option value="30">within 30 days</option>
                <option value="60">within 60 days</option>
              </Form.Control>
              <Form.Control
                type="date"
                style={{ 'margin-left': '30px' }}
                value={this.state.searchDate}
                onChange={this.handleSearchDateChange.bind(this)}
              />
              <Form.Control
                as="select"
                style={{ 'margin-left': '30px' }}
                value={this.state.searchType}
                onChange={this.handleSearchTypeChange.bind(this)}
              >
                <option>-- select --</option>
                <option value="customer">Customer</option>
                <option value="service">Service</option>
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Search.."
                style={{ 'margin-left': '30px' }}
                value={this.state.filter}
                onChange={this.handleFilterChange.bind(this)}
              ></Form.Control>
              <Button
                variant="outline-*"
                style={{ background: 'none', 'margin-left': '5px' }}
                onClick={this.updateAppointment.bind(this)}
              >
                <img src={searchIcon} alt="Search" />
              </Button>
              <Button variant="link" onClick={this.resetAll.bind(this)}>
                Reset
              </Button>
            </Form>
            <table>
              <tr>
                <th>Customer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Service</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
              {currentItems.map((result, index) => (
                // eslint-disable-next-line react/jsx-key
                <tr key={index}>
                  <td>
                    {result.customer.account == null ? '' : result.customer.account.firstName}{' '}
                    {result.customer.account == null ? '' : result.customer.account.lastName}
                  </td>
                  <td>
                    {result.schedule == null ? '' : moment(result.schedule.date.date).format('ll')}
                  </td>
                  <td>{result.schedule == null ? '' : result.schedule.time.time}</td>
                  <td>{result.service.name}</td>
                  <td>$ {result.isOffer ? result.offerPrice : result.service.price}</td>
                  <td>{result.confirmation == 'false' ? 'Await' : 'Confirmed'}</td>
                  <td>
                    <Link to={`/Appointment/Admin/Appointment/${result._id}`}>
                      <Button variant="outline-secondary">details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </table>
            <br />
            <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination.Prev onClick={this.prevPage.bind(this)} />
              <Pagination>{pageNums}</Pagination>
              <Pagination.Next onClick={this.nextPage.bind(this)} />
            </Pagination>
          </div>
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default AppointmentsAdmin;
