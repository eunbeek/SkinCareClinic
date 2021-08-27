import React from 'react';
import { Button, Pagination } from 'react-bootstrap';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import { Link } from 'react-router-dom';
import moment from 'moment';
class Appointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Appointment', title: 'Appointment Home' },
        { url: '/Appointment/Appointments', title: 'View All Appointments' },
        { url: `/Appointment/Create`, title: 'Create Appointment' },
      ],
      _id: localStorage.getItem('_id'),
      appointments: [],
      customer: {},
      account: {},
      currentPage: 1,
      perPage: 8,
    };
  }

  prevPage() {
    if (this.state.currentPage > 1) {
      this.setState({
        currentPage: parseInt(this.state.currentPage) - 1,
      });
    }
  }
  nextPage() {
    if (this.state.currentPage < Math.ceil(this.state.appointments.length / this.state.perPage)) {
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

  getAppointment(custId) {
    fetch(`${process.env.REACT_APP_API_URL}/appointment?customer=${custId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appointments: data,
        });
      });
  }

  componentDidMount() {
    document.title = 'All Appointments | Body Contouring Clinic';

    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
          account: data.account,
        });
        this.getAppointment(this.state.customer._id);
      });
  }

  render() {
    const indexOfLast = this.state.currentPage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currentItems = this.state.appointments.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (let i = 1; i <= Math.ceil(this.state.appointments.length / this.state.perPage); i++) {
      pageNums.push(
        <Pagination.Item key={i} id={i} onClick={this.handlePage.bind(this)}>
          {i}
        </Pagination.Item>
      );
    }

    return (
      <>
        <div className="row">
          <div className="col-md-1"></div>
          <SideBar items={this.state.items} />
          <div className="col-md-8" style={{ 'margin-left': '80px' }}>
            <h2 className="PageTitle">
              Hello, {this.state.account.firstName} {this.state.account.lastName},
              <br />
              These are all your upcoming appointments
            </h2>
            <div className="contents">
              <table>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Price</th>
                </tr>
                {currentItems.map((appointment, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <tr key={index}>
                    <td>
                      {appointment.schedule == null
                        ? ''
                        : moment(
                            appointment.schedule.date.date.split('/')[2] +
                              appointment.schedule.date.date.split('/')[0] +
                              appointment.schedule.date.date.split('/')[1]
                          ).format('ll')}
                    </td>
                    <td>{appointment.schedule == null ? '' : appointment.schedule.time.time}</td>
                    <td>{appointment.service.name}</td>
                    <td>
                      ${' '}
                      {appointment.isOffer == true
                        ? appointment.offerPrice
                        : appointment.service.price}
                    </td>
                    <td>
                      <Link to={`/Appointment/Appointment/${appointment._id}`}>
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
          </div>
        </div>
      </>
    );
  }
}

export default Appointments;
