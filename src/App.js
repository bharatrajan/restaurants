import React, { Component } from 'react';
import './App.css';
import { zipVaildator, locationProvider} from './utils';
import MapDisplay from './MapDisplay';
import RestaurentsList from './RestaurentsList';
import SearchHistory from './SearchHistory';
import zipcodes from 'zipcodes';
import 'bootstrap/dist/css/bootstrap.min.css';
import serializeForm from 'form-serialize';


class App extends Component {

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

  /**
  * @description - Called when browser get the current lat. long. of the user
  * @description - Updates state
  * @callBack
  * @param {object} position - contains current location information
  * @param {boolean} arg2 - yay or nay
  * @returns null
  */  
  geoLocationSuccessHandler = location => {
    this.setState({
        restaurentListColomnSize: "col-sm-4",
        usersCurrentCoords: location.coords,
        searchableAreaCoords: location.coords,
        isUsersCurrentCoordsAvailable: true
    });
  }

  /**
  * @description - Gets geoLocation is user dint block it
  * @lifeCycle
  * @returns null
  */
  componentDidMount() {
      locationProvider.getCurrentPosition(this.geoLocationSuccessHandler);
  }

  /**
  * @description - Extract zipCode from form & calls processZip()
  * @eventListener
  * @param {object} event - From submit evnet
  * @returns null
  */  
  _submitForm = event => {
      //Prevent form default submit action
      event.preventDefault();
      event.stopPropagation();

      //Serialize and extract form data as object
      const formData = serializeForm(this.formEl, {
          hash: true
      });
      this.processZip(formData.zip)
  }
  
  /**
  * @description - Validates zip then gets long. lat. for zip 
  * @description - Updating state based on validation results
  * @param {string} zip - zip entered by user from form
  * @returns null
  */  
  processZip = zip => {
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

  /**
  * @description - Called when user selects a restaurent from list
  * @description - Updates the state
  * @callBack
  * @param {object} selectedRestaurentLocation - location of selected restaurent
  * @returns null
  */
  handleRestaurentOnSelect = selectedRestaurentLocation => {
    this.setState({
      selectedRestaurentLocation
    })
  }

  /**
  * @description:View template renderer
  * @param: None
  * @returns: None
  */  
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
        {/*Header*/}
        <header className="App-header">
          <h1 className="App-title">Restaurant Finder</h1>
        </header>
        <div className="container">
      
       {/*Search history : Display the history of zip user searched before*/} 
       <div className="row">
          <SearchHistory 
            zip={zip}
            onClickHandler={this.processZip}
          ></SearchHistory>       
       </div>       

        {/*Form that taked zip from user*/}
        <div className="form-wrapper row">
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

        {/*Results for reataurent search*/}
        <div className="results-wrapper row">
        
          {/*Displays restaurent list for given search-location
            *Displays only if search-location is provided*/}  
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

          {/*Displays Map if Geo location is ON*/}            
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
