/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import { Form, Row, Col, Container, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';

class CreateFAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      items: [
        { url: '/Request/Admin', title: 'View All Requests' },
        { url: '/Request/FAQ/Admin', title: 'FAQ' },
      ],
      // create faq data
      faq: {
        faqCategory: '',
        title: '',
        contents: '',
      },
      faqCategories: [],
      completed: false,
      _id: localStorage.getItem('_id'),
      authName: {},
      faqCatNull: false,
      titleNull: false,
      contentsNull: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.faq.faqCategory == ''
      ? this.setState({ faqCatNull: true })
      : this.setState({ faqCatNull: false });
    this.state.faq.title == ''
      ? this.setState({ titleNull: true })
      : this.setState({ titleNull: false });
    this.state.faq.contents == ''
      ? this.setState({ contentsNull: true })
      : this.setState({ contentsNull: false });
    fetch(`${process.env.REACT_APP_API_URL}/create-faq`, {
      method: 'POST',
      body: JSON.stringify(this.state.faq),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => this.setState({ completed: true }))
      .catch((err) => console.log(err));
  }

  onFAQCategoryChange(event) {
    this.setState(() => ({
      faq: {
        ...this.state.faq,
        faqCategory: event.target.value,
      },
      faqCatNull: false,
    }));
  }

  onTitleChange(event) {
    this.setState(() => ({
      faq: {
        ...this.state.faq,
        title: event.target.value,
      },
      titleNull: false,
    }));
  }

  onContentsChange(event) {
    this.setState(() => ({
      faq: {
        ...this.state.faq,
        contents: event.target.value,
      },
      contentsNull: false,
    }));
  }

  getFAQCategories() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/faq-categories`)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
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

  componentDidMount() {
    this.getCustomerProfile(this.state._id).then((data) => {
      this.setState({
        authName: data.accountLevelId,
      });
    });

    this.getFAQCategories().then((data) => {
      this.setState({
        faqCategories: data,
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
            pathname: '/Request/FAQ/Admin',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">Create New FAQ</h2>
          <br />
          <Container>
            <Form onSubmit={this.handleSubmit.bind(this)} method="POST">
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Category:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="select"
                    onChange={this.onFAQCategoryChange.bind(this)}
                    isInvalid={this.state.faqCatNull}
                  >
                    <option value="">--Choose--</option>
                    {this.state.faqCategories.map((faqCategory) => (
                      <option key={faqCategory._id} value={faqCategory._id}>
                        {faqCategory.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    FAQ Category is required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Title:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="FAQ Title"
                    onChange={this.onTitleChange.bind(this)}
                    isInvalid={this.state.titleNull}
                  />
                  <Form.Control.Feedback type="invalid">Title is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Contents:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={this.onContentsChange.bind(this)}
                    isInvalid={this.state.contentsNull}
                  />
                  <Form.Control.Feedback type="invalid">Content is required</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Container>
                <Row>
                  <Col xs={6}></Col>
                  <Col md="auto">
                    <Button variant="outline-secondary" href="/Request/FAQ/Admin/">
                      Cancel
                    </Button>
                  </Col>
                  <Button type="submit" variant="outline-info">
                    Save
                  </Button>
                </Row>
              </Container>
            </Form>
            <br />
            <br />
          </Container>
          <br />
        </div>
      </div>
    );
  }
}

export default CreateFAQ;
