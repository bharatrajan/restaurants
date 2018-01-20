import React, { Component } from 'react';
import './App.css';
import { locationProvider } from './geoLocation';
import { zipVaildator } from './utils';
import MapDisplay from './MapDisplay';
import RestaurentsList from './RestaurentsList';
import SearchHistory from './SearchHistory';
import zipcodes from 'zipcodes';
import 'bootstrap/dist/css/bootstrap.min.css';
import serializeForm from 'form-serialize';


class App extends Component {
  constructor(props) {
      super(props);
  }

  state = {
      zip:"",
      usersCurrentCoords: {},
      restaurentListColomnSize : "col-sm-12",
      isUsersCurrentCoordsAvailable: false,
      isZipValid: true,
      searchableAreaCoords: {},
      selectedRestaurentLocation: {
        latitude: "NOT_AVAILABLE",
        longitude: "NOT_AVAILABLE"
      }
  };

  geoLocationSuccessHandler = position => {
    this.setState({
        restaurentListColomnSize: "col-sm-4",
        usersCurrentCoords: position.coords,
        searchableAreaCoords: position.coords,
        isUsersCurrentCoordsAvailable: true
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
      this.handleZip(formData.zip)
  }
  
  handleZip = zip => {
      //ZipCode validation & zip -> long. lat. conversion
      const isZipValid = zipVaildator(zip);
      let position = zipcodes.lookup(zip);

      //Updating state based on validation results
      if (isZipValid && position && position.latitude && position.longitude) {
          this.setState({
              zip,
              isZipValid,
              searchableAreaCoords : {
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

  handleRestaurentOnSelect = selectedRestaurentLocation => {
    this.setState({
      selectedRestaurentLocation
    })
  }

  render() {

      const {
          zip,
          isZipValid,
          usersCurrentCoords,
          searchableAreaCoords,
          restaurentListColomnSize,
          selectedRestaurentLocation,
          isUsersCurrentCoordsAvailable
      } = this.state;


    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Restaurant Finder</h1>
        </header>
        <div className="container">
      
       <div className="row">
          <SearchHistory 
            zip={zip}
            onClickHandler={this.handleZip}
          ></SearchHistory>       
       </div>       


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

        <div className="results-wrapper row">
        
          {(searchableAreaCoords.latitude && searchableAreaCoords.longitude) && 
            <div className={restaurentListColomnSize}>
              <RestaurentsList
                isUserCoordsAvailable={isUsersCurrentCoordsAvailable}
                latitude={searchableAreaCoords.latitude.toString()} 
                longitude={searchableAreaCoords.longitude.toString()}
                handleRestaurentOnSelect={this.handleRestaurentOnSelect}
              ></RestaurentsList>
            </div>
          }

          {(usersCurrentCoords.latitude && usersCurrentCoords.longitude) &&           
            <div className="col-sm-8">
                <MapDisplay ref={googleMaps => this.googleMaps=googleMaps}
                  currentlongitude={usersCurrentCoords.longitude.toString()}
                  currentlatitude={usersCurrentCoords.latitude.toString()}
                  restaurentlongitude={selectedRestaurentLocation.longitude}
                  restaurentlatitude={selectedRestaurentLocation.latitude}                  
                ></MapDisplay>
            </div>              
          }      
        </div>
      </div>
    </div>
    );
  }
}

export default App;
