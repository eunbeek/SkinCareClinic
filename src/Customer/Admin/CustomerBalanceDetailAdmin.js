import React from 'react';
import { Container, Row, Col, Form, Table, Button, Pagination, Alert } from 'react-bootstrap';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Redirect } from 'react-router';

class CustomerBalanceDetailAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: `/Customer/Admin`, title: 'Home' },
        { url: `/Staff/Admin`, title: 'Staff Management' },
        { url: `/Customer/Admin/Balance`, title: 'Balance Management' },
      ],
      _id: localStorage.getItem('_id'),
      balances: [],
      balanceHistory: [],
      profile: {},
      balance: {
        balanceAccount: 0,
        info: '',
        date: new Date(),
      },
      currentPage: 1,
      perPage: 8,
      authName: {},
      infoIsInput: true,
      updateIsValid: true,
      updateError: '',
    };
    this.handleAddBalance = this.handleAddBalance.bind(this);
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

  onUpdateBalance(event) {
    if (event.target.value == '') {
      this.setState({
        updateError: 'Amount is required',
        updateIsValid: false,
        balance: {
          ...this.state.balance,
          balanceAccount: Number(event.target.value),
        },
      });
    }
    this.setState({
      balance: {
        ...this.state.balance,
        balanceAccount: Number(event.target.value),
      },
      updateIsValid: true,
    });
  }

  onUpdateInfo(event) {
    if (event.target.value == '') {
      this.setState({
        balance: {
          ...this.state.balance,
          info: event.target.value,
        },
        infoIsInput: false,
      });
    } else {
      this.setState({
        balance: {
          ...this.state.balance,
          info: event.target.value,
        },
        infoIsInput: true,
      });
    }
  }

  handleAddBalance(e) {
    if (this.state.balance.balanceAccount == '') {
      this.setState({
        updateError: 'Amount is required',
        updateIsValid: false,
      });
      e.preventDefault();
    } else if (isNaN(this.state.balance.balanceAccount)) {
      this.setState({
        updateError: 'Amount should be digit',
        updateIsValid: false,
      });
      e.preventDefault();
    }

    if (this.state.balance.info == '') {
      this.setState({
        infoIsInput: false,
      });
      e.preventDefault();
    }

    fetch(`${process.env.REACT_APP_API_URL}/add-balance/${this.props.id}`, {
      method: 'POST',
      body: JSON.stringify(this.state.balance),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
  }

  getCustomerProfile(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account?balanceHistory=${id}`)
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

  getAuthProfile(id) {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/account/${id}`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  }
  componentDidMount() {
    this.getAuthProfile(this.state._id).then((data) => {
      this.setState({
        authName: data.accountLevelId,
      });
    });

    this.getCustomerProfile(this.props.id).then((data) => {
      this.setState({
        profile: data,
      });
    });

    this.getBalance(this.props.id).then((data) => {
      this.setState({
        balanceHistory: data,
        balances: data.balances,
      });
    });
  }

  sortingByDate(a, b) {
    let dateA = new Date(a.date).getTime();
    let dateB = new Date(b.date).getTime();
    return dateA > dateB ? -1 : 1;
  }

  render() {
    if (
      this.state.authName == null ||
      this.state.authName._id == '60371ad3fda1af6510e75e3a' ||
      this.state.authName._id == '60371ae9fda1af6510e75e3b'
    ) {
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
            Customer : {this.state.profile.firstName + ' ' + this.state.profile.lastName}
          </h2>
          <hr />
          <br />

          <Container class="col-md-8">
            <Form style={{ fontSize: '20px', textAlign: 'left' }}>
              <h4>
                Modify Balance
                <Alert
                  variant="info"
                  style={{
                    fontSize: '16px',
                    display: 'inline',
                    margin: '10px',
                    letterSpacing: '.5px',
                  }}
                >
                  Input negative amount (-) for withdraw; positive amount for deposit
                </Alert>
              </h4>

              <br />
              <Row>
                <Col sm={4}>
                  <Form.Label>
                    Current Balance: ${' '}
                    {this.state.balanceHistory == null
                      ? 0
                      : this.state.balanceHistory.currentBalance}
                  </Form.Label>
                </Col>
                <Col>
                  <Row style={{ display: 'flex' }}>
                    <Col sm={2}>
                      <Form.Label>Amount</Form.Label>
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        value={this.state.updateBalance}
                        style={{ marginLeft: '20px' }}
                        onChange={this.onUpdateBalance.bind(this)}
                        isInvalid={!this.state.updateIsValid}
                      />
                      <Form.Control.Feedback type="invalid">
                        {this.state.updateError}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <br></br>
                  <Row style={{ display: 'flex' }}>
                    <Col sm={2}>
                      <Form.Label>Info</Form.Label>
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        value={this.state.info}
                        style={{ marginLeft: '20px' }}
                        onChange={this.onUpdateInfo.bind(this)}
                        isInvalid={!this.state.infoIsInput}
                      />
                      <Form.Control.Feedback type="invalid">Info is required</Form.Control.Feedback>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={7}></Col>
                    <Col sm={2}>
                      <Button
                        type="submit"
                        variant="outline-info"
                        onClick={this.handleAddBalance.bind(this)}
                      >
                        Update
                      </Button>
                    </Col>
                    <Col></Col>
                  </Row>
                </Col>
              </Row>
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

                  <br />
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

CustomerBalanceDetailAdmin.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CustomerBalanceDetailAdmin;
