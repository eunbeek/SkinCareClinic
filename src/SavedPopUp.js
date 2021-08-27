/* eslint react/prop-types: 0 */
import React from 'react';
import './App.css';
import { Button, Modal } from 'react-bootstrap';

class SavedPopUp extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} centered>
        <Modal.Header>
          <Modal.Title>{this.props.text}</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="outline-info" href={this.props.href}>
            {this.props.button}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SavedPopUp;
