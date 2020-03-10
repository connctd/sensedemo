import React from 'react';
import '../../App.css';

export default class User extends React.Component {
    

    render() {
        return (
            <svg x={this.props.position.x} y={this.props.position.y} height="12" width="12">
                <circle cx="6" cy="6" r="5" stroke="black" fill="white" />
            </svg>
        )
    }
}