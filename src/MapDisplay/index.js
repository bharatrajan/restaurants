import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

class MapDisplay extends Component {
  /**
  * @description - Set props to parent
  * @description - Binds "this" inside "directionsServiceResponseHandler"
  * @constructor
  * @param {object} props - attributes sent from parent
  * @returns none
  */

  constructor(props) {
    super(props);
    this.directionsServiceResponseHandler = this.directionsServiceResponseHandler.bind(
      this
    );
  }

  static PropsTypes = {
    currentlongitude: PropsTypes.string.isRequired,
    currentlatitude: PropsTypes.string.isRequired,
    restaurentlongitude: PropsTypes.string.isRequired,
    restaurentlatitude: PropsTypes.string.isRequired,
  };

  state = {};

  /**
  * @description - Calls calculateAndDisplayRoute
  * @lifeCycle
  * @param {object} nextProps - new props object
  * @returns null
  */

  componentWillReceiveProps(nextProps) {
    this.calculateAndDisplayRoute(nextProps);
  }

  /**
  * @description - Does some initialization
  * @description - calls generateMap
  * @lifeCycle
  * @returns null
  */

  componentDidMount() {
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsDisplay = new window.google.maps.DirectionsRenderer();
    this.generateMap(this.props.currentlongitude, this.props.currentlatitude);
  }

  /**
  * @description - Created a map-object using Google API
  * @description - Appends the map-object into '#map' div
  * @description - Sets the map view area
  * @param {string} currentlongitude - users current location
  * @param {string} currentlatitude - users current location
  * @returns null
  */
  generateMap = (currentlongitude, currentlatitude) => {
    //Null check
    if (!this.mapEl) return;

    //Create & attach map-object
    this.map = new window.google.maps.Map(this.mapEl, {
      zoom: 7,
      center: {
        lat: currentlatitude,
        lng: currentlongitude,
      },
    });
    this.directionsDisplay.setMap(this.map);

    //Sets the map view area
    this.resizeMap();
  };

  /**
  * @description - Displays route from current location to restaurent location
  * @description - Reused the map-object from generateMap()
  * @param {object} arg1 - attributes sent from parent
  * @param {boolean} arg2 - yay or nay
  * @returns null
  */

  calculateAndDisplayRoute = nextProps => {
    let {
      currentlongitude,
      currentlatitude,
      restaurentlongitude,
      restaurentlatitude,
    } =
      nextProps || this.props;

    //Safety object check
    if (
      restaurentlatitude === 'NOT_AVAILABLE' ||
      restaurentlongitude === 'NOT_AVAILABLE'
    )
      return;

    //Request object for Google-API
    let requestBlob = {
      origin: currentlatitude + ', ' + currentlongitude,
      destination: restaurentlatitude + ', ' + restaurentlongitude,
      travelMode: 'DRIVING',
    };

    //Google directions service API call
    this.directionsService.route(
      requestBlob,
      this.directionsServiceResponseHandler
    );
  };

  /**
  * @description - Called when Google directions service API call finished
  * @description - Updates map with driving directions on success
  * @description - Display error message on failure
  * @callBack
  * @param {object} response - API response from google 
  * @param {string} status - Reponse status
  * @returns null
  */

  directionsServiceResponseHandler = (response, status) => {
    this.errorEl.hidden = status === 'OK';
    if (status === 'OK') {
      this.directionsDisplay.setDirections(response);
    }
  };

  /**
  * @description - Programatically adjust width of map
  * @returns null
  */

  resizeMap = () => {
    this.mapEl.style.height = this.mapEl.style.width =
      this.wrapper.offsetWidth + 'px';
  };

  /**
  * @description:View template renderer
  * @param: None
  * @returns: None
  */

  render() {
    return (
      <div className="MapDisplay" ref={wrapper => (this.wrapper = wrapper)}>
        <div
          hidden
          className="align-text-left error-text"
          ref={errorEl => (this.errorEl = errorEl)}
        >
          {' '}Direction service failed{' '}
        </div>
        <div id="map" ref={mapEl => (this.mapEl = mapEl)} />
      </div>
    );
  }
}

export default MapDisplay;
