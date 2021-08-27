/* eslint-disable react/jsx-key */
import React from 'react';
import '../../App.css';
import SideBar from '../../SideBar/SideBar';
import PopUp from '../../PopUp';
import {
  Tabs,
  Tab,
  Card,
  Accordion,
  Container,
  Button,
  Col,
  Row,
  ButtonToolbar,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ViewAllFAQbyAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      items: [
        { url: '/Request/Admin', title: 'View All Requests' },
        { url: '/Request/FAQ/Admin', title: 'FAQ' },
      ],
      children: 'FAQ',
      faqs: [],
      faqCategories: [],
      selectedFAQ: {},
      completed: false,
      _id: localStorage.getItem('_id'),
      authName: {},
    };
    this.showFAQ = this.showFAQ.bind(this);
    this.hideFAQ = this.hideFAQ.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  showFAQ = () => {
    this.setState({ show: true });
  };

  hideFAQ = () => {
    this.setState({ show: false });
  };

  handleDelete = () => {
    this.deleteFAQ()
      .then(() => {
        this.getFAQs().then((data) => {
          this.setState({
            faq: data,
          });
        });
      })
      .then(() => {
        this.refreshPage();
      });

    this.setState({
      show: false,
      selectedFAQ: null,
      completed: true,
    });
  };

  refreshPage = () => {
    window.location.reload();
  };

  getFAQs() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/faqs`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  deleteFAQ() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/faq/` + this.state.selectedFAQ._id, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  getFAQCategory() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/faq-categories`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
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

    this.getFAQs().then((data) => {
      this.setState({
        faqs: data,
      });
    });
    this.getFAQCategory().then((data) => {
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
            pathname: '/Request/FAQ/Admin/',
          }}
        />
      );
    }
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <SideBar items={this.state.items} />
        <div className="col-md-8" style={{ 'margin-left': '80px' }}>
          <h2 className="PageTitle">FAQ</h2>
          <br />
          <Container>
            <Tabs
              id={this.state.faqs._id}
              activeKey={this.state.key}
              onSelect={(key) => this.setState({ key })}
            >
              {this.state.faqCategories.map((result) => (
                <Tab
                  eventKey={result._id}
                  title={result.name}
                  style={{ color: '#393F44', 'margin-top': '10px' }}
                >
                  {this.state.faqs.map((oneFaq) =>
                    oneFaq.faqCategory._id != result._id ? (
                      ''
                    ) : (
                      <Accordion>
                        <Card>
                          <Accordion.Toggle as={Card.Header} eventKey="0">
                            {oneFaq.title}
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              {oneFaq.contents}
                              <p></p>
                              <ButtonToolbar
                                style={{ display: 'flex', justifyContent: 'flex-end' }}
                              >
                                <Link to={`/Request/FAQ/Admin/Edit/${oneFaq._id}`}>
                                  <Button
                                    variant="outline-secondary"
                                    style={{ marginRight: '5px' }}
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline-danger"
                                  style={{ marginRight: '1px' }}
                                  onClick={() => {
                                    this.setState({
                                      show: true,
                                      selectedFAQ: oneFaq,
                                    });
                                  }}
                                >
                                  Delete
                                </Button>
                              </ButtonToolbar>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    )
                  )}
                </Tab>
              ))}
            </Tabs>
          </Container>

          <Container>
            <br />
            <Row>
              <Col xs={9}></Col>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outline-info" href="/Request/FAQ/Admin/Create">
                  Create
                </Button>
              </Col>

              <PopUp
                show={this.state.show}
                handleClose={this.hideFAQ}
                handleDelete={this.handleDelete}
                text={this.state.children}
                btn1="Cancel"
                btn2="Delete"
              />
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

ViewAllFAQbyAdmin.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ViewAllFAQbyAdmin;
