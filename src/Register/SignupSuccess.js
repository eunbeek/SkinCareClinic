import React, { Component } from 'react';
import '../App.css';
import imgName from '../resources/verified_user.png';

class SignupSuccess extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <h1>Thanks for Signing Up!</h1>
          <br></br>
          <img src={imgName} width="230" height="230" style={{ 'margin-left': '10px' }} />

          <p>
            {' '}
            Congrats! Your account is successfully created, you can now sign in with the new
            account.
          </p>
        </div>

        <button type="button" className="btn btn-outline-info" style={{ 'margin-left': '15px' }}>
          <a className="login" href="./Login">
            Go to Log In! ❯
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
export default SignupSuccess;
