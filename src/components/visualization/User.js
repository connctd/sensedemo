import React from 'react';
import '../../App.css';
import { findPositionTracker } from '../../utils/WoTConverter.js';

export default class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = { data: this.props.data, x: this.props.x, y: this.props.y }

        this.resolveThingDescription = this.resolveThingDescription.bind(this);

        this.state.thing = findPositionTracker(this.props.data);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            var newState = this.state;
            newState.thing = findPositionTracker(this.props.data);
            this.setState(newState);
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.resolveThingDescription, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async resolveThingDescription() {
        if (this.state.thing === undefined) {
            return;
        }

        var respX = await fetch(this.state.thing.details.xURL);
        var respY = await fetch(this.state.thing.details.yURL);
        var newState = this.state;

        if (respX.status === 200 && respY.status === 200) {
            var jsonRespX = await respX.json();
            var jsonRespY = await respY.json();

            newState.x = jsonRespX.value;
            newState.y = jsonRespY.value;

            this.setState(newState);
        }
    }

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                width={this.props.width} height={this.props.height}
                x={this.state.x - this.props.width / 2} y={this.state.y - this.props.height / 2} fill={this.props.fill}
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