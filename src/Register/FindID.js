import React, { Component } from 'react';
import '../App.css';

class FindID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
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
      });
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-6" style={{ 'margin-left': '480px' }}>
          <h2 className="PageTitle">Your ID : {this.state.profile.userID}</h2>
          <a className="nav-link" href="./login" onClick={() => localStorage.clear()}>
            Sign In
          </a>
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default FindID;
