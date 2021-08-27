/* eslint-disable no-unused-vars */
import React from 'react';
import SideBar from '../../SideBar/SideBar';
import '../../App.css';
import searchIcon from '../../resources/searchIcon.png';
import { Form, Button, Table, Pagination, Container } from 'react-bootstrap';
import { Redirect } from 'react-router';

class StaffHomeAdmin extends React.Component {
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
      authName: {},
      filterData: [],
      searchStaff: '',
      currentPage: 1,
      perPage: 8,
    };
    this.requestInactiveStaff = this.requestInactiveStaff.bind(this);
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

  handleSearchStaffChange(e) {
    this.setState({
      searchStaff: e.target.value,
    });
  }

  handleSearchStaff() {
    const newStaffs = this.state.profile.filter((req) => {
      let name = req.firstName + req.lastName;
      return name.toLowerCase().includes(this.state.searchStaff.toLowerCase());
    });
    this.setState({ filterData: newStaffs });
  }

  requestInactiveStaff(id) {
    fetch(`${process.env.REACT_APP_API_URL}/inactive-staff/${id}`)
      .then((response) => response.json())
      .then((results) => {
        window.location.reload();
      });
  }

  getStaffProfile(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  getAllStaff() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/accounts`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  verifyStaffLevel(data) {
    const verifiedStaff = data.filter((req) => {
      return req.accountLevelId != null && req.accountLevelId._id == '603719d1ec07da8afc6ff378';
    });
    this.setState({
      profile: verifiedStaff,
      filterData: verifiedStaff,
    });
  }
  componentDidMount() {
    this.getAllStaff().then((data) => {
      this.verifyStaffLevel(data);
    });

    this.getStaffProfile(this.state._id).then((data) => {
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
          <div className="contents"></div>
          <Form inline>
            <h4 className="PageTitle">Staff List</h4>
            <Button
              href="/Staff/Admin/Active"
              action
              variant="outline-info"
              style={{ 'margin-left': '30px' }}
            >
              Active Staff
            </Button>
            <Container style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Form.Control
                type="text"
                placeholder="Search staff"
                value={this.state.searchStaff}
                onChange={this.handleSearchStaffChange.bind(this)}
              ></Form.Control>
              <Button
                variant="outline-*"
                style={{ background: 'none' }}
                onClick={this.handleSearchStaff.bind(this)}
              >
                <img src={searchIcon} alt="Search" />
              </Button>
            </Container>
          </Form>
          <br />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Staff Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((result, index) => (
                <tr key={index}>
                  <td>{result.userID}</td>
                  <td>
                    {result.firstName} {result.lastName}
                  </td>
                  <td>
                    <Button
                      variant="outline-info"
                      onClick={() => {
                        this.requestInactiveStaff(result._id);
                      }}
                    >
                      InActive
                    </Button>
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

export default StaffHomeAdmin;
