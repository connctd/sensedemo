import React from 'react';

export default class Unknown extends React.Component {
  constructor(props) {
      super(props);

      this.state = { data: this.props.data, connected: false }
      this.props.callbackConnected(true);
  }


  render() {
    return (
      <svg>
        <text
          visibility="visible"
          className="ThingText"
          x={this.props.x}
          y={this.props.y}>?
        </text>
      </svg>
    );
  }
}
