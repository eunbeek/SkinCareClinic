import React from 'react';
import '../App.css';
import searchIcon from '../resources/searchIcon.png';
import { Link } from 'react-router-dom';
import moment from 'moment';
import SideBar from '../SideBar/SideBar';
import { Button, Form, Pagination } from 'react-bootstrap';
import { Redirect } from 'react-router';

class RequestHome extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      items: [
        { url: '/Request/', title: 'View All Requests' },
        { url: '/Request/Create', title: 'Create Request' },
        { url: '/Request/FAQ', title: 'FAQ' },
      ],
      children: 'Request',
      auth: 'General',
      _id: localStorage.getItem('_id'),
      user: [],
      requests: [],
      filterRequests: [],
      dayValue: '',
      filter: '',
      startDate: '',
      endDate: '',
      status: '',
      sDateStatus: false,
      eDateStatus: false,

      currentPage: 1,
      perPage: 4,
      authName: {},
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.deleteReq = this.deleteReq.bind(this);
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

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  deleteReq = () => {
    this.setState({ show: false });
  };

  onDayChange(e) {
    this.setState({
      dayValue: e.target.value,
    });
  }
  handleSearchTypeChange(e) {
    this.setState({
      searchType: e.target.value,
    });
  }
  handleStatusChange(e) {
    this.setState({
      status: e.target.value,
    });
  }

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

  getRequests(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/request?customer=${id}`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
          this.setState({
            requests: results,
            filterRequests: results,
          });
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
      } else if (this.state.searchType == 'category') {
        const newRequests = this.state.requests.filter((req) => {
          return req.requestCategory.name.toLowerCase().includes(this.state.filter.toLowerCase());
        });
        this.setState({ filterRequests: newRequests });
      } else if (this.state.searchType == 'service') {
        const newRequests = this.state.requests.filter((req) => {
          return req.serviceCategory != null
            ? req.serviceCategory.name.toLowerCase().includes(this.state.filter.toLowerCase())
            : null;
        });
        this.setState({ filterRequests: newRequests });
      }
    }
  }
  resetAll() {
    this.getRequests(this.state.account._id).then((data) => {
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
  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          user: data.account,
          account: data,
          authName: data.account != null ? data.account.accountLevelId : null,
        });
        this.getRequests(this.state.account._id);
      });
  }

  render() {
    if (this.state.authName == null) {
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
          <h2 className="PageTitle">
            Hi, {this.state.user.firstName + ' ' + this.state.user.lastName}, these are your request
          </h2>
          <br />
          <div className="contents">
            <Form inline>
              <Form.Control
                as="select"
                value={this.state.dayValue}
                onChange={this.onDayChange.bind(this)}
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
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="service">Service</option>
              </Form.Control>
              <Form.Control
                type="text"
                placeholder="Search.."
                value={this.state.filter}
                onChange={this.handleChange.bind(this)}
                style={{ 'margin-left': '30px' }}
              ></Form.Control>
              <Button
                variant="outline-*"
                onClick={this.updateRequest.bind(this)}
                style={{ background: 'none', 'margin-left': '5px' }}
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
                onChange={this.handleStatusChange.bind(this)}
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
                <th>Created Date</th>
                <th>Last Updated Date</th>
                <th>Status</th>
              </tr>
              {currentItems.map(
                (request) =>
                  (this.state.status.length == 0 || this.state.status == 'none'
                    ? request
                    : this.state.status == request.status) && (
                    <tr key={request._id}>
                      <td>
                        <Link to={`/Request/Detail/${request._id}`} style={{ color: 'black' }}>
                          {request.title}
                        </Link>
                      </td>
                      <td>{request.requestCategory.name}</td>
                      <td>{request.serviceCategory == null ? '' : request.serviceCategory.name}</td>
                      <td>{moment(request.date).format('ll')}</td>
                      <td>{moment(request.lastRequestTime).format('lll')}</td>
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
        </div>
      </div>
    );
  }
}

export default RequestHome;
