import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { locationProvider } from './geoLocation';
import _ from 'lodash';
import { zipVaildator } from './utils';
import RestaurentsList from './RestaurentsList';

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

  geoLocationSuccessHandler = position => {
    this.setState({
        coords: position.coords
    });
  }

  componentDidMount() {
      locationProvider.getCurrentPosition(this.geoLocationSuccessHandler);
  }

  _submitForm = event => {
      //Prevent form default submit action
      event.preventDefault();
      event.stopPropagation();

      //Serialize and extract form data as object
      const formData = serializeForm(this.formEl, {
          hash: true
      });

      //ZipCode validation & zip -> long. lat. conversion
      const isZipValid = zipVaildator(formData.zip);
      let position = zipcodes.lookup(formData.zip);

      //Updating state based on validation results
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
        <div className="container">
      
        <div className="form-wrapper row">
          <form className="col-sm-12" onSubmit={this._submitForm}  ref={(formEl) =>
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

        {(coords.latitude && coords.longitude) && 
            <div className="results-wrapper row">
              <div className="col-sm-4">
                <RestaurentsList
                  latitude={coords.latitude.toString()} 
                  longitude={coords.longitude.toString()}
                ></RestaurentsList>
              </div>

              <div className="col-sm-8">
                latitude <br/>
                {coords.latitude}<br/>
                <br/>
                longitude  <br/>
                {coords.longitude}<br/>
              </div>              
            </div>

          }


        </div>
    </div>
    );
  }
}

export default App;
