import React from 'react';
import '../App.css';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ViewAppointmentMessage extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} centered>
        <Modal.Header closeButton onClick={this.props.handleClose}>
          <Modal.Title>Message for this Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.text == null ? 'No Message' : this.props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-info" onClick={this.props.handleClose}>
            Back to appointment
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ViewAppointmentMessage.propTypes = {
  show: PropTypes.string,
  appointmentId: PropTypes.number,
  text: PropTypes.string,
  handleClose: PropTypes.func,
};

export default ViewAppointmentMessage;
