import React, { Component } from 'react';
import PropsTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css';


class MapDisplay extends Component {
  constructor(props) {
      super(props);
  }

  static PropsTypes={
  }


  state = {
    zipList: []
  };

  componentWillReceiveProps(nextProps) {
    this.updateLocalStorage(nextProps.zip)  
    this.generateView()
  }
  
  componentDidMount() {
      this.generateView()
  }

  updateLocalStorage = zip => {
    if(!zip) return
    let zipList = localStorage.getItem('zipList') || "";
        zipList = zipList.trim()
        zipList = zipList.split('$');
    if(zipList.indexOf(zip) === -1){
        if(zipList.length === 5) zipList.shift();
        zipList.push(zip)
        zipList = zipList.join('$')
        localStorage.setItem('zipList', zipList)
    }
  }

  generateView = () => {
    let zipList = localStorage.getItem('zipList');
    if(zipList){
        this.setState({
            zipList: zipList.split('$')
        })
    }      
  }

  clearHistory = () =>{
    localStorage.setItem('zipList', '');
    this.setState({
        zipList: []
    })
  } 
    
  

  render() {
      const items = this.state.zipList.length + 2;
      let c = 9;

      return(

        <div className="btn-group btn-group-justified search-history">
            <a href="#" className="btn btn-primary">History</a>
            
            {this.state.zipList.map((zip, index) => {
                if(zip)
                    return (<a href="#" className="btn zip-item"
                                key={index} 
                                onClick={() => {
                                    this.props.onClickHandler(zip)
                                }}
                            >{zip}</a>)
            })}

            {this.state.zipList.length > 0 && 
                <a 
                    href="#" 
                    className="btn btn-primary" 
                    onClick={this.clearHistory}
                >Clear</a>}
        </div>
        /*/    

        <div className="btn-group btn-group-justified">
            <a href="#" className="btn btn-primary">History</a>
            {this.state.zipList.map((zip, index) => {
                if(zip)
                    return (<a href="#" className="btn"
                                key={index} 
                                type="button" 
                                className=""
                                onClick={() => {
                                    this.props.onClickHandler(zip)
                                }}
                            >{zip}</a>)
            })}

            {this.state.zipList.length > 0 &&
                <a href="#" className="btn btn-primary" onClick={this.clearHistory}>clear</a>}
        </div>

        <ul className="pagination row">
            <li><a href="#">History</a></li>
            {this.state.zipList.map((zip, index) => {
                if(zip)
                    return (<li 
                                key={index} 
                                type="button" 
                                className=""
                                onClick={() => {
                                    this.props.onClickHandler(zip)
                                }}
                            ><a href="#">{zip}</a></li>)
            })}
            {this.state.zipList.length > 0 &&
                <li className="" onClick={this.clearHistory}><a href="#">clear</a></li>}
            
        </ul>
        <div className="row">
            <button type="button" className="">History</button>
            {this.state.zipList.map((zip, index) => {
                if(zip)
                    return (<button 
                                key={index} 
                                type="button" 
                                className=""
                                onClick={() => {
                                    this.props.onClickHandler(zip)
                                }}
                            >{zip}</button>)
            })}
            <button type="button" className="" onClick={this.clearHistory}>clear</button>
        </div>
        /*/            
      )
  }
}


export default MapDisplay;
