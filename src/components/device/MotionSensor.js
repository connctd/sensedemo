import React from 'react';

export default class MotionSensor extends React.Component {
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

        if (jsonResp[this.state.data.details.stateProperty]) {
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
        viewBox="0 0 50 50" pointerEvents="bounding-box">
        <title>{this.props.data.details.name} {this.props.data.id}</title>
          <path id="Pfad #2" strokeWidth="3"
        fill="none"
        d="M 8.26,42.48
           C 7.33,41.68 7.25,40.38 7.25,40.38
             7.25,40.38 7.26,38.85 8.00,38.09
             8.82,37.23 10.38,37.12 10.38,37.12
             10.38,37.12 12.10,37.21 12.96,38.13
             13.65,38.88 13.50,40.50 13.50,40.50
             13.50,40.50 13.51,41.58 12.74,42.39
             12.17,42.98 10.75,43.38 10.75,43.38
             10.75,43.38 9.07,43.17 8.26,42.48 Z
           M 10.25,25.25
           C 10.25,25.25 15.69,27.09 19.75,31.12
             23.42,34.76 25.75,40.62 25.75,40.62M 13.38,4.50
           C 13.38,4.50 27.29,9.32 34.50,16.50
             44.22,26.19 46.38,37.75 46.38,37.75M 10.25,13.25
           C 10.25,13.25 20.10,17.10 27.00,24.00
             33.79,30.79 37.62,40.62 37.62,40.62" />
        </svg>
    );
  }
}
