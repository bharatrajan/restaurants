import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class MapDisplay extends Component {
  state = {
    zipList: [],
  };

  /**
  * @description - Updates LocalStorage
  * @description - Generated new view
  * @lifeCycle
  * @returns null
  */
  componentWillReceiveProps(nextProps) {
    this.updateLocalStorage(nextProps.zip);
    this.generateView();
  }

  /**
  * @description - Generated new view
  * @lifeCycle
  * @returns null
  */

  componentDidMount() {
    this.generateView();
  }

  /**
  * @description - Pushes zip into localStorage 
  * @description - Save only the latest 5 searchs
  * @description - Makes sure no ducplication
  * @param {string} zip - zip that need to be pushed
  * @returns null
  */
  updateLocalStorage = zip => {
    //Null check
    if (!zip) return;

    //Grab zip list from localStorage & convert into Array
    let zipList = localStorage.getItem('zipList') || '';
    zipList = zipList.trim();
    zipList = zipList.split('$');

    //Makes sure no ducplication
    //Save only the latest 5 searchs
    if (zipList.indexOf(zip) === -1) {
      if (zipList.length === 5) zipList.shift();
      zipList.push(zip);
      zipList = zipList.join('$');
      localStorage.setItem('zipList', zipList);
    }
  };

  /**
  * @description - Grab zip list from localStorage then updates state
  * @returns null
  */

  generateView = () => {
    let zipList = localStorage.getItem('zipList');
    if (zipList) {
      this.setState({
        zipList: zipList.split('$'),
      });
    }
  };

  /**
  * @description - Called when user hits the clear button
  * @description - Wipes off localStorage & updates state
  * @eventListener
  * @param {object} event - click event from 'clear' button
  * @returns null
  */

  //Wipes off localStorage & updates state
  clearHistory = event => {
    localStorage.setItem('zipList', '');
    this.setState({
      zipList: [],
    });
  };

  /**
  * @description:View template renderer
  * @param: None
  * @returns: None
  */

  render() {
    return (
      <div className="btn-group btn-group-justified search-history">
        <a href="#" className="btn history btn-primary">
          History
        </a>

        {this.state.zipList.map((zip, index) => {
          if (zip)
            return (
              <a
                href="#"
                className="btn zip-item"
                key={index}
                onClick={() => this.props.onClickHandler(zip)}
              >
                {zip}
              </a>
            );
          return null;
        })}

        {/* Clear button is displayed only if zip list is not empty*/}
        {this.state.zipList.length > 0 &&
          <a href="#" className="btn btn-primary" onClick={this.clearHistory}>
            Clear
          </a>}
      </div>
    );
  }
}

export default MapDisplay;
