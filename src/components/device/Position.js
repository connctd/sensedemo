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
        fill="none" stroke="black"
        d="M 25.00,0.00
           C 25.00,0.00 25.00,50.00 25.00,50.00M 0.00,25.00
           C 0.00,25.00 50.00,25.00 50.00,25.00M 20.00,3.53
           C 15.58,4.85 11.64,6.64 8.53,10.18
             -5.56,26.21 8.88,51.35 30.00,46.47
             46.73,42.61 52.79,21.44 40.67,9.33
             35.03,3.68 27.60,2.29 20.00,3.53 Z" />
        </svg>
    );
  }
}
