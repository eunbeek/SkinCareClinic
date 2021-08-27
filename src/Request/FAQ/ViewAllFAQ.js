/* eslint-disable react/jsx-key */
import React from 'react';
import '../../App.css';
import { Accordion, Container, Tabs, Tab, Card } from 'react-bootstrap';

class ViewAllFAQ extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      faqs: [],
      faqCategories: [],
    };
  }

  getFAQs() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/faqs`)
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

  componentDidMount() {
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
    return (
      <div className="contents" style={{ 'text-align': 'left', 'margin-right': '280px' }}>
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
                          <Card.Body>{oneFaq.contents}</Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  )
                )}
              </Tab>
            ))}
          </Tabs>

          <br />
          <br />
          <br />
          <br />
          <br />
        </Container>
        <br />
        <br />
      </div>
    );
  }
}

export default ViewAllFAQ;
