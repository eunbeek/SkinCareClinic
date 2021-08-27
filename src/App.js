/* eslint react/prop-types: 0 */
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';
import Home from './Home/Home';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backServer: false,
      count: 0,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <Home />
        <br />
        <br />
        <br />
        <br />
        <Footer />
      </div>
    );
  }
}

export default App;
