import React, { Component } from 'react';
import { getRestaurentsList } from '../api';
import PropsTypes from 'prop-types';
import './RestaurentsList.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

class RestaurentsList extends Component {
  static PropsTypes = {
    isUserCoordsAvailable: PropsTypes.bool.isRequired,
    longitude: PropsTypes.string.isRequired,
    latitude: PropsTypes.string.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps))
      this.callAPIAndUpdateState(nextProps.longitude, nextProps.latitude);
  }

  componentDidMount() {
    const { longitude, latitude } = this.props;
    this.callAPIAndUpdateState(longitude, latitude);
  }

  state = {};

  successHandler = resp => {
    let selectedRestaurant = null;

    if (resp.nearby_restaurants[0])
      selectedRestaurant = resp.nearby_restaurants[0].restaurant;

    this.setState({
      selectedRestaurant,
      location: resp.location,
      restaurants: resp.nearby_restaurants,
    });

    this.props.handleRestaurentOnSelect(selectedRestaurant.location);
  };

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

  getClassName = (restaurant, index) => {
    if (
      this.props.isUserCoordsAvailable &&
      _.isEqual(this.state.selectedRestaurant, restaurant)
    ) {
      return 'list-group-item active';
    } else {
      return 'list-group-item';
    }
  };

  handleRestaurentOnClick = selectedRestaurant => {
    if (!_.isEqual(this.state.selectedRestaurant, selectedRestaurant)) {
      this.setState({ selectedRestaurant });
      this.props.handleRestaurentOnSelect(selectedRestaurant.location);
    }
  };

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
                className={this.getClassName(item.restaurant, index)}
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
