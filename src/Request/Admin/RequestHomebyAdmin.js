import React from 'react';
import '../../App.css';
import searchIcon from '../../resources/searchIcon.png';
import SideBar from '../../SideBar/SideBar';
import { Button, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Redirect } from 'react-router';

class RequestHomebyAdmin extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [
        { url: '/Request/Admin', title: 'View All Requests' },
        { url: '/Request/FAQ/Admin', title: 'FAQ' },
      ],
      children: 'Request',
      auth: 'Admin',
      dayValue: 0,
      status: '',
      startDate: '',
      endDate: '',
      filter: '',
      requests: [],
      filterRequests: [],
      searchType: [],
      eDateStatus: false,
      sDateStatus: false,
      tempStart: '',
      tempEnd: '',

      currentPage: 1,
      perPage: 8,
      _id: localStorage.getItem('_id'),
      authName: {},
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.deleteReq = this.deleteReq.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
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
    if (this.state.currentPage < Math.ceil(this.state.filterRequests.length / this.state.perPage)) {
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

  handleStatusChange(e) {
    this.setState({
      status: e.target.value,
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
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  deleteReq = () => {
    this.setState({ show: false });
  };

  onStartDateChange = (e) => {
    this.setState({
      eDateStatus: false,
      sDateStatus: false,
      startDate: e.target.value,
    });

    if (moment(e.target.value).isBefore(this.state.endDate)) {
      this.setState({
        eDateStatus: false,
        sDateStatus: false,
      });
    } else {
      this.setState({
        sDateStatus: true,
        eDateStatus: true,
      });
    }
  };

  onEndDateChange = (e) => {
    this.setState({
      eDateStatus: false,
      sDateStatus: false,
      endDate: e.target.value,
    });

    if (moment(this.state.startDate).isBefore(e.target.value)) {
      this.setState({
        eDateStatus: false,
        sDateStatus: false,
      });
    } else {
      this.setState({
        sDateStatus: true,
        eDateStatus: true,
      });
    }
  };

  handleChange = (event) => {
    this.setState({ filter: event.target.value });
  };
  getRequests() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/requests`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }
  resetAll() {
    this.getRequests().then((data) => {
      this.setState({
        requests: data,
        filterRequests: data,
        searchType: '',
        searchDate: '',
        filter: '',
        startDate: '',
        endDate: '',
        dayValue: 9999,
      });
    });
  }
  updateRequest() {
    if (this.state.startDate && this.state.endDate) {
      const newRequest = this.state.requests.filter((req) => {
        return moment(req.date).isBetween(this.state.startDate, this.state.endDate);
      });
      this.setState({ filterRequests: newRequest });
    } else if (this.state.dayValue) {
      this.setState({
        startDate: '',
        endDate: '',
      });
      const newRequests = this.state.requests.filter((req) => {
        return moment().subtract(parseInt(this.state.dayValue), 'days').isBefore(moment(req.date));
      });
      this.setState({ filterRequests: newRequests });
    } else if (this.state.searchType) {
      if (this.state.searchType == 'title') {
        const newRequests = this.state.requests.filter((req) => {
          return req.title.toLowerCase().includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterRequests: newRequests });
      } else if (this.state.searchType == 'customerID') {
        const newRequests = this.state.requests.filter((req) => {
          return req.customer.account.userID
            .toLowerCase()
            .includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterRequests: newRequests });
      } else if (this.state.searchType == 'customerName') {
        const newRequests = this.state.requests.filter((req) => {
          let name = req.customer.account.firstName + req.customer.account.lastName;
          return name.toLowerCase().includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterRequests: newRequests });
      }
    }
  }

  getCustomerProfile() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`)
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

    this.getRequests().then((data) => {
      this.setState({
        requests: data,
        filterRequests: data,
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
    const currentItems = this.state.filterRequests.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (let i = 1; i <= Math.ceil(this.state.filterRequests.length / this.state.perPage); i++) {
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
          <h2 className="PageTitle">View All Request</h2>
          <br />
          <div className="contents">
            <Form inline>
              <Form.Control
                as="select"
                name="days"
                value={this.state.dayValue}
                onChange={this.handleDayChange}
              >
                <option value="9999">N/A</option>
                <option value="30">Last 30 Days</option>
                <option value="60">Last 60 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="120">Last 120 Days</option>
              </Form.Control>
              <Form.Control
                id="startDate"
                onChange={this.onStartDateChange.bind(this)}
                value={this.state.startDate}
                type="date"
                style={{ 'margin-left': '30px', 'margin-right': '15px' }}
                isInvalid={this.state.sDateStatus}
              />
              ~
              <Form.Control
                id="endDate"
                onChange={this.onEndDateChange.bind(this)}
                value={this.state.endDate}
                type="date"
                style={{ 'margin-left': '15px' }}
                isInvalid={this.state.eDateStatus}
              />
              <Form.Control
                as="select"
                style={{ 'margin-left': '30px' }}
                onChange={this.handleSearchTypeChange.bind(this)}
              >
                <option value="">N/A</option>
                <option value="customerID">Customer ID</option>
                <option value="customerName">Customer Name</option>
                <option value="title">Title</option>
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Search.."
                style={{ 'margin-left': '30px' }}
                value={this.state.filter}
                onChange={this.handleChange}
              ></Form.Control>
              <Button
                variant="outline-*"
                style={{ background: 'none', 'margin-left': '5px' }}
                onClick={this.updateRequest.bind(this)}
              >
                <img src={searchIcon} alt="Search" />
              </Button>
              <Button variant="link" onClick={this.resetAll.bind(this)}>
                Reset
              </Button>
              <Form.Control
                as="select"
                name="request-status"
                value={this.state.status}
                onChange={this.handleStatusChange}
                style={{ 'margin-left': '50px' }}
              >
                <option value="none" default>
                  All
                </option>
                <option value="unsolved">Unsolved</option>
                <option value="in-progress">In-Progress</option>
                <option value="solved">Solved</option>
              </Form.Control>
            </Form>
            <br />
            <table>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Service</th>
                <th>Customer UserID</th>
                <th>Customer Name</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>

              {currentItems.map(
                (request, index) =>
                  (this.state.status.length == 0 || this.state.status == 'none'
                    ? request
                    : this.state.status == request.status) && (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/Request/Admin/Details/${request._id}`}
                          style={{ color: 'black' }}
                        >
                          {request.title}
                        </Link>
                      </td>
                      <td>{request.requestCategory.name}</td>
                      <td>
                        {!request.serviceCategory
                          ? 'no service involved'
                          : request.serviceCategory.name}
                      </td>
                      <td>{!request.customer ? ' ' : request.customer.account.userID}</td>
                      <td>
                        {!request.customer
                          ? ' '
                          : request.customer.account.firstName +
                            ' ' +
                            request.customer.account.lastName}
                      </td>
                      <td>{moment(request.date).format('lll')}</td>
                      <td>{request.status}</td>
                    </tr>
                  )
              )}
            </table>
            <br />
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

export default RequestHomebyAdmin;
