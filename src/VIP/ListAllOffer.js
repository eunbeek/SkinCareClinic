/* eslint-disable react/jsx-key */
import React from 'react';
import '../App.css';
import { Button, Card, CardColumns } from 'react-bootstrap';
import moment from 'moment';

class ListAllOffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      account: {},
      _id: localStorage.getItem('_id'),
    };
  }

  getOffers() {
    return new Promise((resolve) => {
      fetch(`${process.env.REACT_APP_API_URL}/offers`)
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/account/${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          account: data.accountLevelId,
        });
        this.getOffers().then((data) => {
          this.setState({
            offers: data,
          });
        });
      });
  }

  render() {
    return (
      <div>
        <CardColumns>
          {this.state.offers.map((result) => (
            <Card>
              <Card.Img
                variant="top"
                src={process.env.REACT_APP_IMAGE_URL + '/file/' + result.imageURL}
              />
              <Card.Body>
                <Card.Title>{result.name}</Card.Title>
                <Card.Text>
                  {moment(result.startDate).format('ll')} ~ {moment(result.endDate).format('ll')}
                </Card.Text>
                <Card.Text>{result.description}</Card.Text>
                <Card.Text>$ {result.price}</Card.Text>
                {this.state.account._id == '603719d1ec07da8afc6ff378' ? (
                  ''
                ) : (
                  <Button variant="outline-info" href={`/Appointment/Offer/Create/${result._id}`}>
                    Book
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </div>
    );
  }
}

export default ListAllOffer;
