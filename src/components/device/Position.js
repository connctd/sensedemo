import React from 'react';

export default class Position extends React.Component {
  constructor(props) {
      super(props);

      this.state = { data: this.props.data, x: this.props.x, y: this.props.y, connected: false, cbConnected: this.props.callbackConnected }
      
      this.resolveThingDescription = this.resolveThingDescription.bind(this);
  }

  componentDidMount() {
      this.interval = setInterval(this.resolveThingDescription, 1000);
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  async resolveThingDescription() {
      var respX = await fetch(this.state.data.details.xURL);
      var respY = await fetch(this.state.data.details.yURL);
      var newState = this.state;

      if (respX.status === 200 && respY.status === 200) {
        this.state.cbConnected(true);
        var jsonRespX = await respX.json();
        var jsonRespY = await respY.json();

        newState.x = jsonRespX.value;
        newState.y = jsonRespY.value;

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
        x={this.state.x} y={this.state.y} fill={this.props.fill}
            viewBox="0 0 50 50">
          <path id="Pfad"
        fill="none" stroke="black" strokeWidth="2"
        d="M 25.00,1.00
           C 25.00,1.00 25.00,49.00 25.00,49.00M 1.00,25.00
           C 1.00,25.00 49.00,25.00 49.00,25.00M 21.00,9.53
           C 0.05,16.25 9.07,45.28 29.00,40.47
             40.15,37.78 44.68,23.91 37.58,15.04
             33.18,9.54 27.60,8.46 21.00,9.53 Z" />
        </svg>
    );
  }
}
