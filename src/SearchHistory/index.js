import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class MapDisplay extends Component {
  state = {
    zipList: [],
  };

  componentWillReceiveProps(nextProps) {
    this.updateLocalStorage(nextProps.zip);
    this.generateView();
  }

  componentDidMount() {
    this.generateView();
  }

  updateLocalStorage = zip => {
    if (!zip) return;
    let zipList = localStorage.getItem('zipList') || '';
    zipList = zipList.trim();
    zipList = zipList.split('$');
    if (zipList.indexOf(zip) === -1) {
      if (zipList.length === 5) zipList.shift();
      zipList.push(zip);
      zipList = zipList.join('$');
      localStorage.setItem('zipList', zipList);
    }
  };

  generateView = () => {
    let zipList = localStorage.getItem('zipList');
    if (zipList) {
      this.setState({
        zipList: zipList.split('$'),
      });
    }
  };

  clearHistory = () => {
    localStorage.setItem('zipList', '');
    this.setState({
      zipList: [],
    });
  };

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

        {this.state.zipList.length > 0 &&
          <a href="#" className="btn btn-primary" onClick={this.clearHistory}>
            Clear
          </a>}
      </div>
    );
  }
}

export default MapDisplay;
