import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { locationProvider } from './geoLocation';
import _ from 'lodash';
import { zipVaildator } from './utils';
import zipcodes from 'zipcodes';
import 'bootstrap/dist/css/bootstrap.min.css';
import serializeForm from 'form-serialize';


class App extends Component {
  constructor(props) {
      super(props);
  }

  state = {
      coords: {},
      isZipValid: true
  };

  componentDidMount() {
      locationProvider.getCurrentPosition(this.geoLocationSuccessHandler, this.geoLocationErrorHandler);
  }

  geoLocationSuccessHandler = position => {
      this.setState({
          coords: position.coords
      });
  }

  geoLocationErrorHandler = err => {
    console.log("Geo Location Error : ",err)
  }

  _submitForm = event => {
      event.preventDefault();
      event.stopPropagation();
      const formData = serializeForm(this.formEl, {
          hash: true
      });
      console.log("formData : ", formData);

      const isZipValid = zipVaildator(formData.zip);
      let position = zipcodes.lookup(formData.zip);

      if (isZipValid && position && position.latitude && position.longitude) {
          this.setState({
              isZipValid,
              coords: {
                  latitude: position.latitude,
                  longitude: position.longitude
              }
          })
      } else {
          this.setState({
              isZipValid: false
          })
      }
  }

  render() {

      const {
          isZipValid,
          coords
      } = this.state;

      console.log('coords : ', coords);
      console.log('isZipValid : ', isZipValid);


    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Restaurant Finder</h1>
        </header>

        <div className="form-wrapper">
          <form className="" onSubmit={this._submitForm}  ref={(formEl) =>
            { this.formEl = formEl; }}>
              <div className="form-group zipcode-box-wrapper">
                <input 
                  name="zip"
                  type="Zipcode" 
                  id="zipCodeBox"
                  className="form-control" 
                  placeholder="Enter Zipcode"></input>
                  <small 
                    className="form-text error-text"
                    hidden={isZipValid}
                    >Invalid Zipcode</small>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
        </div>

        <div className="results-wrapper">
          latitude <br/>
          {coords.latitude}<br/>
          <br/>
          longitude  <br/>
          {coords.longitude}<br/>
        </div>

      </div>
    );
  }
}

export default App;
