import React, { Component } from 'react';
import '../App.css';
import imgName from '../resources/mailbox_black.png';

class CheckConfirmEmail extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <h2>Check your email to complete to Sign Up!</h2>
          <p>
            {' '}
            A verification mail has been sent to your email account. Please check your inbox to
            verify.
          </p>
        </div>

        <img src={imgName} width="250" height="250" />
        <br></br>
        <button type="button" className="btn btn-outline-info" style={{ 'margin-left': '40px' }}>
          <a className="login" href="./SignupSuccess">
            Email confirmed! ❯
          </a>
        </button>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
export default CheckConfirmEmail;
