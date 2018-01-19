import React, { Component } from 'react';
import { getRestaurentsList } from '../api';
import PropsTypes from 'prop-types'
import './RestaurentsList.css';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';


class RestaurentsList extends Component {
  constructor(props) {
      super(props);
  }

  static PropsTypes={
    longitude : PropsTypes.string.isRequired,
    latitude : PropsTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const {longitude,latitude} = nextProps;
    this.callAPIAndUpdateState(longitude,latitude)                
  }
  
  componentDidMount() {
      const {longitude,latitude} = this.props;      
      this.callAPIAndUpdateState(longitude,latitude)
  }

  state = {
  };


  successHandler = resp => 
    this.setState({
        location : resp.location,
        restaurants : resp.nearby_restaurants
    }); 

  callAPIAndUpdateState = (longitude,latitude) => {
    if(longitude && latitude){
        getRestaurentsList(longitude,latitude, this.successHandler, console.error)
    }
  }

  render() {
    const {location, restaurants} = this.state

    if(_.isEmpty(location) || _.isEmpty(restaurants))
        return(<div className="RestaurentsList"></div>)
    else
        return (
            <div class="RestaurentsList panel panel-default">
                <div class="panel-heading restaurent-location-title">
                    {`${location.city_name}, ${location.country_name}`}
                </div>

                    <ul className='restaurent-list list-group panel-body'>
                        {restaurants.map(item => 
                            <li className="list-group-item">
                                {console.log("restaurant : ", item.restaurant)}
                                <div className="restaurant-name">{item.restaurant.name}</div>
                                <div className="restaurant-cuisines">{item.restaurant.cuisines}</div>
                                <small className="restaurant-rating">{`${item.restaurant.user_rating
                                    .aggregate_rating}/5, ${item.restaurant.user_rating
                                        .rating_text}` }</small>
                                <small className="restaurant-votes">{item.restaurant.votes}</small>
                            </li>
                        )}
                    </ul>                
                </div>

        );
  }
}


export default RestaurentsList;
