import React from 'react';
import '../../App.css';
import Lamp from '../device/Lamp.js';
import Unknown from '../device/Unknown.js';
import Position from '../device/Position.js';
import MotionSensor from '../device/MotionSensor.js';
import { getPositionWithOffset } from '../../utils/Positioning.js'

export default class Thing extends React.Component {
    constructor(props) {
        super(props);

        this.state = { data: this.props.data, connected: false }
        this.updateConnected = this.updateConnected.bind(this);
    }

    updateConnected(isConnected) {
        var newState = this.state;
        
        if (isConnected && !this.state.connected) {
            newState.connected = true;
            this.setState(newState);
        } else if (!isConnected && this.state.connected) {
            newState.connected = false;
            this.setState(newState);
        }
    }

    render() {
        let data = this.props.data;
        let elementPosition = getPositionWithOffset(data.position, this.props.offset)
        
        var node;
        if (this.props.data.details.type === 'lamp') {
            node = <Lamp
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        } else if (this.props.data.details.type === 'motionsensor') {
            node = <MotionSensor
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        } else if (this.props.data.details.type === 'position') {
            node = <Position
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        } else {
            node = <Unknown
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        }

        return (
            <svg>
                <svg onMouseOver={this.hover} onMouseOut={this.hoverOut} >
                    {node}
                </svg>

                <text
                    visibility={this.state.connected ? 'hidden' : 'visible'}
                    x={elementPosition.x + (20 / 2)}
                    y={elementPosition.y + (20 / 2+1)}
                    className="ThingText">
                        Not conncted
                </text>
            </svg>
        )
    }
}