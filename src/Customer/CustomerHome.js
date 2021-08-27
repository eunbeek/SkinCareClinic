import React from 'react';
import SideBar from '../SideBar/SideBar';
import '../App.css';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class CustomerHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Customer', title: 'Home' },
        { url: `/Customer/Profile`, title: 'Profile' },
        { url: `/Customer/Balance/${localStorage.getItem('_id')}`, title: 'Balance' },
      ],
      _id: localStorage.getItem('_id'),
      customer: {},
      account: {},
      appointments: [],
      requests: [],
      balanceHistory: {},
      balances: [],
      authName: {},
    };
  }

  getBalances(id) {
    fetch(`${process.env.REACT_APP_API_URL}/balance-history/${id}`)
      .then((response) => response.json())
      .then((results) => {
        this.setState({
          balanceHistory: results,
          balances: results.balances,
        });
      });
  }

  getRequests(id) {
    fetch(`${process.env.REACT_APP_API_URL}/request?customer=${id}`)
      .then((response) => response.json())
      .then((results) => {
        this.setState({
          requests: results,
        });
      });
  }

  getAppointments(custId) {
    fetch(`${process.env.REACT_APP_API_URL}/appointment?customer=${custId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appointments: data,
        });
      });
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
          account: data.account,
          authName: data.account != null ? data.account.accountLevelId : null,
        });
        this.getAppointments(this.state.customer._id);
        this.getRequests(this.state.customer._id);
        this.getBalances(this.state.account != null ? this.state.account.balanceHistory : null);
      });
  }

  render() {
    if (this.state.authName == null) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }

    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-6" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">
            Hi, {this.state.account.firstName} {this.state.account.lastName}{' '}
          </h2>
          <hr />
          <br />
          <h4>Appointment of Clinic</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Therapy Name</th>
                <th>Staff Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.appointments != null &&
                this.state.appointments.map((appointment, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <tr>
                    <td>{index + 1}</td>
                    <td>{appointment.service.name}</td>
                    <td>
                      {appointment.schedule.staff == null
                        ? ''
                        : appointment.schedule.staff.account.firstName}
                      {appointment.schedule.staff == null
                        ? ''
                        : appointment.schedule.staff.account.lastName}{' '}
                    </td>
                    <td>
                      {appointment.schedule == null
                        ? ''
                        : moment(appointment.schedule.date.date).format('ll')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <a href="/Appointment/">Go to appointment</a>
          <hr />

          <h4>History of Request</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.requests.map((request, index) => (
                // eslint-disable-next-line react/jsx-key
                <tr>
                  <td>{index + 1}</td>
                  <td>{request.title}</td>
                  <td>{request.status}</td>
                  <td>{moment(request.date).format('ll')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <a href="/Request/">Go to request</a>
          <hr />

          <h4>History of balance</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Price</th>
                <th>Info</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.balances.map((balance, index) => (
                // eslint-disable-next-line react/jsx-key
                <tr>
                  <td>{index + 1}</td>
                  <td>${balance.balanceAccount}</td>
                  <td>{balance.info}</td>
                  <td>{moment(balance.date).format('ll')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Link to={`/Customer/Balance/${this.state._id}`}>Go to balance</Link>
          <hr />
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default CustomerHome;
