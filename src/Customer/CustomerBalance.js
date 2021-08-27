import React from 'react';
import SideBar from '../SideBar/SideBar';
import '../App.css';
import { Form, Row, Col, Container, Table, Pagination } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router';

class CustomerBalance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Customer', title: 'Home' },
        { url: `/Customer/Profile`, title: 'Profile' },
        { url: `/Customer/Balance/${localStorage.getItem('_id')}`, title: 'Balance' },
      ],
      _id: localStorage.getItem('_id'),
      balances: [],
      balanceHistory: [],
      profile: {},
      balanceHistoryId: [],
      currentPage: 1,
      perPage: 8,
      authName: {},
    };
    this.getCustomerProfile = this.getCustomerProfile.bind(this);
  }

  prevPage() {
    if (this.state.currentPage > 1) {
      this.setState({
        currentPage: parseInt(this.state.currentPage) - 1,
      });
    }
  }

  nextPage() {
    if (this.state.currentPage < Math.ceil(this.state.balances.length / this.state.perPage)) {
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

  getCustomerProfile() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  getBalance(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/balance-history/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  componentDidMount() {
    this.getCustomerProfile().then((data) => {
      this.setState({
        profile: data,
        balanceHistoryId: data.balanceHistory,
        authName: data.accountLevelId,
      });

      this.getBalance(
        this.state.balanceHistoryId == null ? null : this.state.balanceHistoryId._id
      ).then((data) => {
        this.setState({
          balanceHistory: data,
          balances: data.balances,
        });
      });
    });
  }

  sortingByDate(a, b) {
    let dateA = new Date(a.date).getTime();
    let dateB = new Date(b.date).getTime();
    return dateA > dateB ? -1 : 1;
  }
  render() {
    if (this.state.authName == null) {
      return <Redirect push to={{ pathname: '/' }} refresh="true" />;
    }

    this.state.balances.sort(this.sortingByDate);
    const indexOfLast = this.state.currentPage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currentItems = this.state.balances.slice(indexOfFirst, indexOfLast);

    const pageNums = [];
    for (let i = 1; i <= Math.ceil(this.state.balances.length / this.state.perPage); i++) {
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
            Hi, {this.state.profile.firstName + ' ' + this.state.profile.lastName}
          </h2>
          <hr />
          <br />

          <Container class="col-md-8">
            <Form style={{ fontSize: '20px', textAlign: 'left' }}>
              <h4>Balance Information</h4>
              <br />
              <Col sm={4}>
                <Form.Label>
                  Current Balance: ${' '}
                  {this.state.balanceHistory == null ? 0 : this.state.balanceHistory.currentBalance}
                </Form.Label>
              </Col>
            </Form>
          </Container>
          <br />
          <h4>Balance History</h4>
          <Container class="col-md-8">
            <Table>
              <Row>
                <Col md={12}>
                  <table>
                    <tr>
                      <th>Date</th>
                      <th>info</th>
                      <th>Update</th>
                    </tr>
                    {currentItems == null
                      ? ''
                      : currentItems.map((result) => (
                          <tr key={result._id}>
                            <td>{moment(result.date).format('ll')}</td>
                            <td>{result.info}</td>
                            <td>$ {result.balanceAccount}</td>
                          </tr>
                        ))}
                  </table>
                </Col>
              </Row>
            </Table>
            <br />
            <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination.Prev onClick={this.prevPage.bind(this)} />
              <Pagination>{pageNums}</Pagination>
              <Pagination.Next onClick={this.nextPage.bind(this)} />
            </Pagination>
          </Container>
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default CustomerBalance;
