import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

class MapDisplay extends Component {
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

  componentWillReceiveProps(nextProps) {
    this.calculateAndDisplayRoute(nextProps);
  }

  componentDidMount() {
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsDisplay = new window.google.maps.DirectionsRenderer();
    this.generateMap(this.props.currentlongitude, this.props.currentlatitude);
  }

  generateMap = (currentlongitude, currentlatitude) => {
    if (!this.mapEl) return;
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {
        lat: currentlatitude,
        lng: currentlongitude,
      },
    });
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
    this.resizeMap();
  };

  calculateAndDisplayRoute = nextProps => {
    let {
      currentlongitude,
      currentlatitude,
      restaurentlongitude,
      restaurentlatitude,
    } =
      nextProps || this.props;

    if (
      restaurentlatitude === 'NOT_AVAILABLE' ||
      restaurentlongitude === 'NOT_AVAILABLE'
    )
      return;

    let requestBlob = {
      origin: currentlatitude + ', ' + currentlongitude,
      destination: restaurentlatitude + ', ' + restaurentlongitude,
      travelMode: 'DRIVING',
    };
    this.directionsService.route(
      requestBlob,
      this.directionsServiceResponseHandler
    );
  };

  directionsServiceResponseHandler = (response, status) => {
    this.errorEl.hidden = status === 'OK';
    if (status === 'OK') {
      this.directionsDisplay.setDirections(response);
    }
  };

  resizeMap = () => {
    this.mapEl.style.height = this.mapEl.style.width =
      this.wrapper.offsetWidth + 'px';
  };

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
