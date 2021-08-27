import React from 'react';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import { Button, Pagination } from 'react-bootstrap';
import PopUp from '../../PopUp';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Redirect } from 'react-router';

class ManageOffer extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [
        { url: '/VIP/Admin', title: 'Special Offer' },
        { url: '/VIP/Admin/Manage', title: 'Offer Manage' },
        { url: '/VIP/Admin/Manage/Create', title: 'Create Offer' },
      ],
      children: 'Offer',
      offers: [],
      authName: {},
      _id: localStorage.getItem('_id'),
      selectedOffer: {},
      currentPage: 1,
      perPage: 8,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  prevPage() {
    if (this.state.currentPage > 1) {
      this.setState({
        currentPage: parseInt(this.state.currentPage) - 1,
      });
    }
  }
  nextPage() {
    if (this.state.currentPage < Math.ceil(this.state.offers.length / this.state.perPage)) {
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

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleDelete = () => {
    this.deleteOffer().then(() => {
      this.getOffers().then((data) => {
        this.setState({
          offers: data,
        });
      });
    });

    this.setState({
      show: false,
      selectedOffer: null,
    });
  };

  getOffers() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/offers`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  deleteOffer() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/offer/` + this.state.selectedOffer._id, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
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
    this.getOffers().then((data) => {
      this.setState({
        offers: data,
      });
    });

    this.getCustomerProfile(this.state._id).then((data) => {
      this.setState({
        authName: data.accountLevelId,
      });
    });
  }
  render() {
    if (
      this.state.authName == null ||
      this.state.authName._id == '60371ad3fda1af6510e75e3a' ||
      this.state.authName._id == '60371ae9fda1af6510e75e3b'
    ) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }

    const indexOfLast = this.state.currentPage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currentItems = this.state.offers.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (let i = 1; i <= Math.ceil(this.state.offers.length / this.state.perPage); i++) {
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
          <h2 className="PageTitle">Monthly Special Offers</h2>
          <br />
          <div className="contents">
            <br />
            <table>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Title</th>
                <th>Contents</th>
                <td></td>
                <td></td>
              </tr>
              {currentItems.map((result) => (
                // eslint-disable-next-line react/jsx-key
                <tr key={result._id}>
                  <td>
                    {moment(result.startDate).format('ll')} ~ {moment(result.endDate).format('ll')}
                  </td>
                  <td>${result.price}</td>
                  <td>{result.name}</td>
                  <td>{result.description}</td>
                  <td>
                    <Link to={`/VIP/Admin/Manage/Edit/${result._id}`}>
                      <Button variant="outline-secondary">Edit</Button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        this.setState({
                          show: true,
                          selectedOffer: result,
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                  <PopUp
                    show={this.state.show}
                    handleClose={this.hideModal}
                    handleDelete={this.handleDelete}
                    text={this.state.children}
                    btn1="Cancel"
                    btn2="Delete"
                  />
                </tr>
              ))}
            </table>
            <br />
            <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination.Prev onClick={this.prevPage.bind(this)} />
              <Pagination>{pageNums}</Pagination>
              <Pagination.Next onClick={this.nextPage.bind(this)} />
            </Pagination>
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default ManageOffer;
