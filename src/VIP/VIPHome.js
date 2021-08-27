import React from 'react';
import '../App.css';
import SideBar from '../SideBar/SideBar';
import ListAllOffer from './ListAllOffer';
import { Redirect } from 'react-router';

class VIPHome extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [{ url: '/VIP/', title: 'Special Offer' }],
      authName: {},
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
        authName: data.accountLevelId,
      });
    });
  }

  render() {
    if (this.state.authName == null || this.state.authName._id == '60371ad3fda1af6510e75e3a') {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Monthly Special Offers</h2>
          <br />
          <div className="contents">
            <br />
            <ListAllOffer />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default VIPHome;
