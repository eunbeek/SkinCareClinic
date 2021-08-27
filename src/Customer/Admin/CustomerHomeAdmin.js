import React from 'react';
import SideBar from '../../SideBar/SideBar';
import '../../App.css';
import searchIcon from '../../resources/searchIcon.png';
import { Form, Button, Table, Pagination, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class CustomerHomeAdmin extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      admin: {},
      profile: [],
      items: [
        { url: `/Customer/Admin`, title: 'Home' },
        { url: `/Staff/Admin`, title: 'Staff Management' },
        { url: `/Customer/Admin/Balance`, title: 'Balance Management' },
      ],
      _id: localStorage.getItem('_id'),
      filterData: [],
      searchCustomer: '',
      currentPage: 1,
      perPage: 8,
      authName: {},
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
    if (this.state.currentPage < Math.ceil(this.state.filterData.length / this.state.perPage)) {
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

  handleSearchCustomerChange(e) {
    this.setState({
      searchCustomer: e.target.value,
    });
  }

  handleSearchCustomer() {
    const newCustomers = this.state.profile.filter((req) => {
      let name = req.firstName + req.lastName;
      return name.toLowerCase().includes(this.state.searchCustomer.toLowerCase());
    });
    this.setState({ filterData: newCustomers });
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

  getAllCustomer() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/accounts`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  verifyCustomerLevel(data) {
    const verifiedCustomer = data.filter((req) => {
      return !(req.accountLevelId != null && req.accountLevelId._id == '603719d1ec07da8afc6ff378');
    });
    this.setState({
      profile: verifiedCustomer,
      filterData: verifiedCustomer,
    });
  }

  componentDidMount() {
    this.getAllCustomer().then((data) => {
      this.verifyCustomerLevel(data);
    });

    this.getCustomerProfile(this.state._id).then((data) => {
      this.setState({
        admin: data,
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
    const currentItems = this.state.filterData.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (let i = 1; i <= Math.ceil(this.state.filterData.length / this.state.perPage); i++) {
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
            Hi, Staff - {this.state.admin.firstName} {this.state.admin.lastName}{' '}
          </h2>
          <hr />
          <div className="contents">
            <Form inline>
              <h4 className="PageTitle">Customer List</h4>
              <Container style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Form.Control
                  type="text"
                  placeholder="Search customer"
                  value={this.state.searchCustomer}
                  onChange={this.handleSearchCustomerChange.bind(this)}
                ></Form.Control>
                <Button
                  variant="outline-*"
                  style={{ background: 'none' }}
                  onClick={this.handleSearchCustomer.bind(this)}
                >
                  <img src={searchIcon} alt="Search" />
                </Button>
              </Container>
            </Form>
            <br />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Customer Level</th>
                <th>Detail</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((result, index) => (
                <tr key={index}>
                  <td>{result.userID}</td>
                  <td>
                    {result.firstName} {result.lastName}
                  </td>
                  <td>{result.accountLevelId == null ? '' : result.accountLevelId.name}</td>
                  <td>
                    <Link to={`/Customer/Admin/Profile/${result._id}`}>Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br />
          <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination.Prev onClick={this.prevPage.bind(this)} />
            <Pagination>{pageNums}</Pagination>
            <Pagination.Next onClick={this.nextPage.bind(this)} />
          </Pagination>
        </div>
      </div>
    );
  }
}

export default CustomerHomeAdmin;
