import React, { Component } from 'react';
import { getRestaurentsList } from '../api';
import PropsTypes from 'prop-types';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

class RestaurentsList extends Component {
  static PropsTypes = {
    isUserCoordsAvailable: PropsTypes.bool.isRequired,
    longitude: PropsTypes.string.isRequired,
    latitude: PropsTypes.string.isRequired,
  };

  /**
  * @description - If new is different from old props, makes API call
  * @lifeCycle
  * @param {object} nextProps - new props object
  * @returns null
  */
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps))
      this.callAPIAndUpdateState(nextProps.longitude, nextProps.latitude);
  }

  /**
  * @description - Makes API call
  * @lifeCycle
  * @returns null
  */

  componentDidMount() {
    const { longitude, latitude } = this.props;
    this.callAPIAndUpdateState(longitude, latitude);
  }

  state = {};

  /**
  * @description - Handle Zamoto API response
  * @description - Updates state with API response
  * @description - Makes first item default selected
  * @description - Pass on selected location to parent
  * @callBack
  * @param {object} resp - response from API
  * @returns null
  */

  successHandler = resp => {
    let selectedRestaurant = null;

    //Makes first item default selected
    if (resp.nearby_restaurants[0])
      selectedRestaurant = resp.nearby_restaurants[0].restaurant;

    //Update state
    this.setState({
      selectedRestaurant,
      location: resp.location,
      restaurants: resp.nearby_restaurants,
    });

    //Pass on selected location to parent
    this.props.handleRestaurentOnSelect(selectedRestaurant.location);
  };

  /**
  * @description - Maked API call
  * @param {string} longitude - longitude of the searchable area
  * @param {string} latitude - latitude of the searchable area
  * @returns null
  */

  callAPIAndUpdateState = (longitude, latitude) => {
    if (longitude && latitude) {
      getRestaurentsList(
        longitude,
        latitude,
        this.successHandler,
        console.error
      );
    }
  };

  /**
  * @description - Simple utilty to selected item style
  * @param {object} restaurant - User selected restaurant
  * @returns {string} className 
  */

  getClassName = restaurant => {
    if (
      this.props.isUserCoordsAvailable &&
      _.isEqual(this.state.selectedRestaurant, restaurant)
    ) {
      return 'list-group-item active';
    } else {
      return 'list-group-item';
    }
  };

  /**
  * @description - Called when user selects a restaurent
  * @description - Updates state and propogate location of selected restaurant to parent 
  * @eventListener
  * @param {object} selectedRestaurant - User selected restaurant
  * @returns null
  */

  handleRestaurentOnClick = selectedRestaurant => {
    if (!_.isEqual(this.state.selectedRestaurant, selectedRestaurant)) {
      this.setState({ selectedRestaurant });
      this.props.handleRestaurentOnSelect(selectedRestaurant.location);
    }
  };

  /**
  * @description:View template renderer
  * @param: None
  * @returns: None
  */

  render() {
    const { location, restaurants } = this.state;

    if (_.isEmpty(location) && _.isEmpty(restaurants))
      return <div className="RestaurentsList" />;
    else if (!_.isEmpty(location) && _.isEmpty(restaurants))
      return (
        <div className="RestaurentsList"> No Restaurents present here!! </div>
      );
    else
      return (
        <div className="RestaurentsList panel panel-default">
          <div className="panel-heading restaurent-location-title">
            {`${location.city_name}, ${location.country_name}`}
          </div>

          <ul className="restaurent-list list-group panel-body">
            {restaurants.map((item, index) =>
              <li
                key={index}
                className={this.getClassName(item.restaurant)}
                onClick={() => this.handleRestaurentOnClick(item.restaurant)}
              >
                <div className="restaurant-name">
                  {item.restaurant.name}
                </div>
                <div className="restaurant-cuisines">
                  {item.restaurant.cuisines}
                </div>
                <small className="restaurant-rating">{`${item.restaurant
                  .user_rating.aggregate_rating}/5, ${item.restaurant
                  .user_rating.rating_text}`}</small>
                <small className="restaurant-votes">
                  {item.restaurant.votes}
                </small>
                <br />
                <small className="restaurant-votes">
                  {item.restaurant.location.address}
                </small>
              </li>
            )}
          </ul>
        </div>
      );
  }
}

export default RestaurentsList;
