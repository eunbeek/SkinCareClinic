import React from 'react';
import '../App.css';
import logo from '../resources/brand-logo.png';
import underBar from '../resources/underBar.png';
import RouterConfig from '../RouterConfig';

class HomeAdmin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
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
              <a className="nav-link" href="/VIP/Admin">
                VIP
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Appointment/Admin/Appointments">
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
              <a className="nav-link" href="/">
                Log out
              </a>
            </li>
          </ul>
        </nav>
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

export default HomeAdmin;
