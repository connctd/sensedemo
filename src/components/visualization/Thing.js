import React from 'react';
import '../../App.css';
import Lamp from '../device/Lamp.js';
import Unknown from '../device/Unknown.js';
import MotionSensor from '../device/MotionSensor.js';
import Switch from '../device/Switch.js';
import { getPositionWithOffset } from '../../utils/Positioning.js'

export default class Thing extends React.Component {
    constructor(props) {
        super(props);

        this.thingRef = React.createRef();

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
                        ref={this.thingRef}
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
                        ref={this.thingRef}
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        } else if (this.props.data.details.type === 'switch') {
            node = <Switch
                        ref={this.thingRef}
                        data={this.state.data}
                        callbackConnected={this.updateConnected}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                    />;
        } else if (this.props.data.details.type === 'position') {
            node = null;
        } else {
            node = <Unknown
                        ref={this.thingRef}
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
            <svg onMouseOver={this.hover} 
                    onMouseOut={this.hoverOut}
                    onContextMenu={
                        event => {
                            this.props.mouseInputHandlerRef.current.onThingRightClick(event, this.state.data);
                        }
                    }>
                <svg>
                    {node}
                </svg>

                <text
                    visibility={this.state.connected || node == null ? 'hidden' : 'visible'}
                    x={elementPosition.x + (20 / 2)}
                    y={elementPosition.y + (20 / 2+1)}
                    className="ThingText">
                        Not conncted
                </text>
            </svg>
        )
    }
}