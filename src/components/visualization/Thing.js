import React from 'react';
import '../../App.css';
import Lamp from '../device/Lamp.js';
import { getPositionWithOffset } from '../../utils/Positioning.js'

export default class Thing extends React.Component {
    constructor(props) {
        super(props);

        this.state = { data: this.props.data, reachable: false, fillColor: "#CCCCCC" }
        this.underlyingThing = React.createRef();

        this.resolveThingDescription = this.resolveThingDescription.bind(this);
        this.responseReceived = this.responseReceived.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.resolveThingDescription, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    resolveThingDescription() {
        if (this.state.data.href == null || this.state.data.href === "") {
            return;
        }

        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', this.responseReceived);
        xhr.open('GET', this.state.data.href);
        
        xhr.setRequestHeader("X-External-Subject-ID", "default");
        xhr.send();
    }

    responseReceived(res) {
        var newState = this.state;

        if (res.target.status !== 200) {
            newState.reachable = false;
            newState.fillColor = "#CCCCCC";
        }  else {
            newState.reachable = true;
            newState.lastState = JSON.parse(res.target.response);

            // TODO this depends on the device type and property
            if (newState.lastState.value) {
                newState.fillColor = "orange";
            } else {
                newState.fillColor = "black";
            }
        }
        
        this.setState(newState);
    }

    hover(e) {
        
    }

    hoverOut(e) {
        
    }

    render() {
        let data = this.props.data;
        let elementPosition = getPositionWithOffset(data.position, this.props.offset)
        
        return (
            <svg>
                <svg onMouseOver={this.hover} onMouseOut={this.hoverOut} >
                    <Lamp
                        lastState={this.state.lastState}
                        key={data.id}
                        x={elementPosition.x}
                        y={elementPosition.y}
                        width={20}
                        height={20}
                        fill={this.state.fillColor}
                    />
                </svg>

                <text
                    visibility={this.state.reachable ? 'hidden' : 'visible'}
                    x={elementPosition.x + (20 / 2)}
                    y={elementPosition.y + (20 / 2+1)}
                    className="ThingText">
                        Not conncted
                </text>
            </svg>
        )
    }
}