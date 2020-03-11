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

    async resolveThingDescription() {
        var resp = await fetch(this.state.data.details.stateURL);
        this.responseReceived(resp);
    }

    async responseReceived(resp) {
        var newState = this.state;

        if (resp.status === 200) {
            var jsonResp = await resp.json();

            newState.reachable = true;
            if (!this.state.reachable) {
                this.setState(newState);
            }

            newState.lastState = jsonResp;

            if (newState.lastState.value && newState.fillColor !== "orange") {
                newState.fillColor = "orange";
                this.setState(newState);
            } else if (!newState.lastState.value && newState.fillColor !== "black") {
                newState.fillColor = "black";
                this.setState(newState);
            }
        }
        else {
            if (this.state.reachable) {
                console.log("Failed to resolve " + this.state.data.stateURL + " Bad status code " + resp.status);
                if (this.state.reachable) {
                    newState.reachable = false;
                    this.setState(newState);
                }
            }
        }
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