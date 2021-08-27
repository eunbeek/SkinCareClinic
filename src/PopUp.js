/* eslint react/prop-types: 0 */
import React from 'react';
import './App.css';
import { Modal, Button } from 'react-bootstrap';

class PopUp extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} centered>
        <Modal.Header closeButton onClick={this.props.handleClose}>
          <Modal.Title>Delete {this.props.text}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure to delete this {this.props.text.toLowerCase()}?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            {this.props.btn1}
          </Button>
          <Button variant="primary" onClick={this.props.handleDelete} href={this.props.link}>
            {this.props.btn2}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PopUp;
