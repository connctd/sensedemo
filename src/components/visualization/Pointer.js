import React from 'react';
import '../../App.css';

export default class Pointer extends React.Component {
    render() {
        if (this.props.position.x === 0 && this.props.position.y === 0) {
            return <svg></svg>;
        }

        return (
            <svg x={this.props.position.x-6} y={this.props.position.y-6} height="12" width="12">
                <circle cx="6" cy="6" r="5" stroke="black" fill="white" />
            </svg>
        )
    }
}