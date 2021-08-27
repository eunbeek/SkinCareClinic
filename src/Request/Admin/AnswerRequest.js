import React from 'react';
import SideBar from '../../SideBar/SideBar';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import moment from 'moment';

class AnswerRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { url: '/Request/Admin', title: 'View All Requests' },
        { url: '/Request/FAQ/Admin', title: 'FAQ' },
      ],
      request: {},
      request_answer: '',
      completed: false,
      answer: {
        answer: '',
        status: '',
      },
      _id: localStorage.getItem('_id'),
      answerNull: false,
      statusNull: false,
      authName: {},
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      answerNull: false,
      statusNull: false,
    });

    if (this.state.request.answer == '' || this.state.answer.status == '') {
      this.state.request.answer == ''
        ? this.setState({ answerNull: true })
        : this.setState({ answerNull: false });
      this.state.answer.status == ''
        ? this.setState({ statusNull: true })
        : this.setState({ statusNull: false });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/request/${this.props.id}`, {
        method: 'PUT',
        body: JSON.stringify(this.state.answer),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => this.setState({ completed: true }))
        .catch((err) => console.log(err));
    }
  }

  onAnswerChange(e) {
    this.setState(() => ({
      request: {
        ...this.state.request,
        answer: e.target.value,
      },
      answer: {
        ...this.state.answer,
        answer: e.target.value,
      },
    }));
  }

  onStatusChange(e) {
    this.setState(() => ({
      request: {
        ...this.state.request,
        status: e.target.value,
      },
      answer: {
        ...this.state.answer,
        status: e.target.value,
      },
    }));
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

    fetch(`${process.env.REACT_APP_API_URL}/request/${this.props.id}`)
      .then((result) => result.json())
      .then((result) => {
        this.setState({
          request: result,
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

    if (this.state.completed) {
      return (
        <Redirect
          push
          to={{
            pathname: `/Request/Admin/Details/${this.state.request._id}`,
          }}
        />
      );
    }
    const reqTitle = {
      'font-size': 'large',
      'font-weight': 'bold',
      color: 'black',
    };

    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Answer Request</h2>
          <br />
          <div className="contents" style={{ 'text-align': 'left', 'margin-right': '250px' }}>
            <Container>
              <Form onSubmit={this.handleSubmit.bind(this)} method="PUT">
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>
                    Q: {this.state.request.title}{' '}
                    {' (' + moment(this.state.request.date).format('ll') + ')'}
                  </Form.Label>
                  <Form.Control as="textarea" readOnly value={this.state.request.contents} />
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>
                    A: RE: {this.state.request.title}{' '}
                    {' (' + moment(this.state.request.date).format('ll') + ')'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={this.state.request.answer}
                    onChange={this.onAnswerChange.bind(this)}
                    isInvalid={this.state.answerNull}
                  />
                  <Form.Control.Feedback type="invalid">Answer is required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group style={{ 'background-color': '#F5F9F9' }}>
                  <Form.Label style={reqTitle}>Request Status</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.onStatusChange.bind(this)}
                    isInvalid={this.state.statusNull}
                  >
                    <option default>----Choose----</option>
                    <option value="unsolved">Unsolved</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="solved">Solved</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">Status is required</Form.Control.Feedback>
                </Form.Group>
                <Container>
                  <Row>
                    <Col xs={9}></Col>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="outline-secondary" href="/Request/Admin/">
                        Cancel
                      </Button>
                    </Col>
                    <Button type="submit" variant="outline-info">
                      Save
                    </Button>
                  </Row>
                </Container>
              </Form>
            </Container>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

AnswerRequest.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AnswerRequest;
