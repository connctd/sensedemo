import React from 'react';
import jp from 'jsonpath';

export default class Switch extends React.Component {
  constructor(props) {
      super(props);

      this.state = { data: this.props.data, connected: false, cbConnected: this.props.callbackConnected, fillColor: "#000000" }
      
      this.resolveThingDescription = this.resolveThingDescription.bind(this);
  }

  componentDidMount() {
      this.interval = setInterval(this.resolveThingDescription, 1000);
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  async resolveThingDescription() {
      var resp = await fetch(this.state.data.details.stateURL);
      var newState = this.state;

      if (resp.status === 200) {
        this.state.cbConnected(true);
        var jsonResp = await resp.json();

        var value = [];
        try {
          value = jp.query(jsonResp, this.state.data.details.statePropertyPath);
        }
        catch (e) {
          console.log("Failed to extract state path data")          
        }

        if (value.length === 1 && value[0] === "1") {
          newState.fillColor = "#11CC66";
        } else {
          newState.fillColor = "#000000";
        }

        this.setState(newState);
      }
      else {
        this.state.cbConnected(false);  
      }
  }

  render() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
        width={this.props.width} height={this.props.height}
        x={this.props.x} y={this.props.y} stroke={this.state.fillColor}
        viewBox="0 0 51 51" pointerEvents="bounding-box">
        <title>{this.props.data.details.name} {this.props.data.id}</title>
        <path id="Auswahl"
        fill="none" stroke-width="3"
        d="M 10.02,3.65
           C 7.37,4.82 5.95,5.41 4.45,8.10
             2.13,12.28 2.99,26.60 3.00,32.00
             3.01,36.45 2.73,41.09 6.39,44.35
             10.90,48.37 25.77,47.01 32.00,47.00
             35.29,46.99 38.92,47.20 41.90,45.55
             49.29,41.44 47.04,24.56 47.00,17.00
             46.98,13.20 47.05,9.43 44.35,6.39
             41.55,3.25 37.89,3.06 34.00,3.00
             27.97,2.92 15.37,2.53 10.02,3.65 Z
           M 25.00,6.75
           C 25.00,6.75 25.12,42.50 25.12,42.50" />
        </svg>
    );
  }
}
