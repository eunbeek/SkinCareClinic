import React from 'react';
import '../App.css';
import logo from '../resources/brand-logo.png';
import underBar from '../resources/underBar.png';
import RouterConfig from '../RouterConfig';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      authName: {},
      isLogin: localStorage.getItem('isLogin'),
      _id: localStorage.getItem('_id'),
    };
  }

  getCustomerProfile(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  componentDidMount() {
    this.getCustomerProfile(this.state._id).then((data) => {
      this.setState({
        profile: data,
        authName: data.accountLevelId,
      });
    });
  }

  render() {
    let auth;
    if (this.state.isLogin) {
      if (this.state.authName._id == '60371ad3fda1af6510e75e3a') {
        auth = (
          <nav className="nav-back navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link">BodyContouringClinic@gmail.com</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">(416) 966 - 0006</a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Service">
                  Service and Prices
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Appointment">
                  Appointment
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Request">
                  Request
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Customer">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => localStorage.clear()}>
                  Log out
                </a>
              </li>
            </ul>
          </nav>
        );
      } else if (this.state.authName._id == '603719d1ec07da8afc6ff378') {
        auth = (
          <nav className="nav-back navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link">BodyContouringClinic@gmail.com</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">Admin</a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Service">
                  Service and Prices
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/VIP/Admin">
                  VIP
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Appointment/Admin/">
                  Appointment
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Request/Admin">
                  Request
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Customer/Admin">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Staff/Schedules/Calendar">
                  Schedule
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => localStorage.clear()}>
                  Log out
                </a>
              </li>
            </ul>
          </nav>
        );
      } else if (this.state.authName._id == '60371ae9fda1af6510e75e3b') {
        auth = (
          <nav className="nav-back navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link">BodyContouringClinic@gmail.com</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">(416) 966 - 0006</a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Service">
                  Service and Prices
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/VIP">
                  VIP
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Appointment">
                  Appointment
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Request">
                  Request
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Customer">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => localStorage.clear()}>
                  Log out
                </a>
              </li>
            </ul>
          </nav>
        );
      }
    } else {
      auth = (
        <nav className="nav-back navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link">BodyContouringClinic@gmail.com</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">(416) 966 - 0006</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Service">
                Service and Prices
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Register/Login">
                LogIn
              </a>
            </li>
          </ul>
        </nav>
      );
    }
    return (
      <div className="App">
        {auth}
        <br />
        <img src={logo} alt="logo" />
        <br />
        <br />
        <img src={underBar} alt="bar" />
        <br />
        <br />
        <br />
        <RouterConfig />
      </div>
    );
  }
}

export default Home;
