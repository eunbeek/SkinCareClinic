import React, { Component } from 'react';
import '../App.css';
import { Scrollbars } from 'rc-scrollbars';
import { Form } from 'react-bootstrap';
import axios from 'axios';

class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: true,
      contents: '',
    };
  }
  componentDidMount() {
    this.getTermsAndCondition();
  }

  getTermsAndCondition() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/terms-and-conditions`)
      .then((resp) => {
        this.setState({
          contents: resp.data.length && resp.data[0].contents,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  checkIfBoxIsChecked(e) {
    let checked = document.getElementById('check');
    if (checked.checked == false) {
      e.preventDefault();
      this.setState({ isChecked: false });
    } else {
      this.setState({ isChecked: true });
    }
  }
  onCheckBoxChange() {
    let checked = document.getElementById('check');
    if (checked.checked == true) {
      this.setState({ isChecked: true });
    }
  }
  render() {
    const { contents } = this.state;
    return (
      <div className="col-md-8" style={{ margin: '0 auto' }}>
        <h2 className="PageTitle" style={{ textAlign: 'center' }}>
          Terms and Conditions
        </h2>
        <br></br>
        <Scrollbars style={{ width: 500, height: 300, margin: '0 auto' }}>
          <p>{contents}</p>
        </Scrollbars>

        <br></br>
        <form style={{ margin: '0 auto' }}>
          <div className="form-group">
            <div className="form-check">
              <Form.Check
                required
                label="Agree to terms and conditions"
                isInvalid={!this.state.isChecked}
                feedback="You must agree before going to next step"
                onChange={this.onCheckBoxChange.bind(this)}
                id="check"
              />
            </div>
          </div>
        </form>

        <div style={{ marginLeft: '10px' }}>
          <div className="pagination" style={{ justifyContent: 'space-evenly' }}>
            <a className="page-link btn btn-outline-info" href="./Login">
              ❮ Previous
            </a>
            <a
              className="page-link btn btn-outline-info"
              href="./SignUp"
              onClick={this.checkIfBoxIsChecked.bind(this)}
            >
              Next ❯
            </a>
          </div>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }
}
export default TermsAndConditions;
